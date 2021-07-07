import inspect
import re
from studio.web.frontend import ServeHTML, ServeStatic
import zipfile
import base64

import cv2
import pandas as pd
import numpy as np
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers, callbacks, optimizers, losses, applications

from time import sleep
from glob import glob
from gc import collect
from concurrent.futures import ThreadPoolExecutor
from os import name, path as pathlib, listdir
from tqdm.cli import tqdm
from sklearn.model_selection import train_test_split

from studio.web import App, Request, json_response, text_response, Lith, types
from studio.web.core.websocket import WebSocketServer
from studio.trainer import Trainer
from studio.manage import Workspace, WorkspaceManager
from studio.graph import GraphDef
from studio.dataset import DATASETS, Dataset
from studio.structs import DataDict
from studio.utils import download_options, generate_args
from studio.logging import Logger

"""
TODO
    1. Document view functions.
"""

# root path
ROOT_PATH = pathlib.abspath("./")

# defining globals
app = App()
html_serve = ServeHTML(path="./templates/")
static_serve = ServeStatic(path="./templates/")

lith_sys = Lith("sys")
lith_workspace = Lith("workspace")
lith_dataset = Lith("dataset")
lith_model = Lith("model")
lith_train = Lith("train")
lith_custom = Lith("custom")

workspace_manager = WorkspaceManager()
trainer = Trainer(workspace_manager)
logger = Logger(name="main")

# updating training session
logger.log("updating globals")
trainer.update_session(globals())

# loading dataset from cached data
try:
    logger.log("reading existing dataset")
    Dataset = DATASETS.get(workspace_manager.active.dataset[['meta:type']])
    dataset = Dataset(**workspace_manager.active.dataset.to_dict())
    exec(workspace_manager.active[['dataset:meta:preprocessor']])
    func = locals().get('dataset_proprocessor')
    try:
        logger.log("applying preprocessor")
        dataset.apply(func)
    except Exception as e:
        logger.sys_error(e)
    trainer.update_session({
        "dataset": dataset
    })
except Exception as e:
    logger.sys_error(f"Error updating dataset, {repr(e)}")

@app.get("/",)
async def index(request: Request) -> types.template:
    return await html_serve.get("index.html")

@app.get("/static/<path:file>")
async def static_view(request: Request, file: str) -> types.static:
    _, *file = file.split("/")
    file = "/".join(file)
    return await static_serve.get(file)

@lith_sys.post("/path")
async def sys_path(request: Request) -> types.dict:
    path = (await request.get_json()).get('path')
    if not path:
        return []
    elif pathlib.isfile(path):
        return []
    elif pathlib.isdir(path):
        return list(map(lambda x: pathlib.join(path, x), listdir(path)))
    else:
        d, p = pathlib.split(path)
        if pathlib.isdir(d):
            return list(map(lambda x: pathlib.join(d, x) if p in x else None, listdir(d)))
        return []

# Workspace endpoints


@lith_workspace.get("/active")
async def workspace_active(request: Request) -> types.dict:
    return {"data": workspace_manager.active.to_dict()}


@lith_workspace.get("/active/<str:var>")
async def workspace_active_var(request: Request, var: str) -> types.dict:
    return workspace_manager.active[var].to_dict()


@lith_workspace.post("/active/<str:var>")
async def workspace_active_var(request: Request, var: str) -> types.dict:
    var_data = await request.get_json()
    workspace_manager.active[var] = var_data
    return {"status": True}


@lith_workspace.get("/var/<path:key>")
async def workspace_active_var_key(request: Request, key: str) -> types.dict:
    try:
        var = workspace_manager.active[[
            key.replace("/var/", "").replace("/", ":")]]
        return {"data": var.to_dict() if isinstance(var, DataDict) else var}
    except KeyError:
        return {"data": None}


@lith_workspace.get("/recent")
async def workspace_recent(request: Request) -> types.dict:
    return {"data": workspace_manager.cache.recent}


@lith_workspace.get("/all")
async def workspace_all(request: Request) -> types.dict:
    return workspace_manager.get_workspaces()


@lith_workspace.post("/new")
async def workspace_new(request: Request) -> types.dict:
    data = await request.get_json()
    workspace = workspace_manager.new_workspace(**data)
    assert workspace.idx == workspace_manager.active.idx
    return {
        "status": True
    }


@lith_workspace.post("/open/<str:name>")
async def workspace_open(request: Request, name: str) -> types.dict:
    workspace_manager.open_workspace(name)
    assert workspace_manager.active.idx == name
    return {
        "status": True,
    }


@lith_workspace.post("/delete/<str:name>")
async def workspace_new(request: Request, name: str) -> types.dict:
    return {
        "status": workspace_manager.delete_workspace(name),
    }


# download endpoints

@lith_workspace.post("/download")
async def download_model(request: Request) -> types.dict:
    data = await request.get_json()
    prep_func = download_options[data['format']]
    status = prep_func(workspace_manager.active, trainer)
    return await json_response(status)


@lith_workspace.get("/download/<str:name>")
async def download_name(request: Request, name: str) -> types.file:
    return await send_file(
        pathlib.join(
            workspace_manager.active.path,
            "outputs",
            name
        ),
        request=request
    )


# Dataset endpoints

@lith_dataset.post("/add")
async def dataset_init(request: Request) -> types.dict:
    data = await request.get_json()
    try:
        dataset = DATASETS.get(data['meta']['type'])(**data)
        trainer.update_session({
            "dataset": dataset
        })
        return {"status": True, "sample": dataset.sample()}
    except Exception as e:
        return {"status": False, "message": repr(e)}


@lith_dataset.get("/preprocess")
async def dataset_preprocess(request: Request) -> types.dict:
    exec(workspace_manager.active[['dataset:meta:preprocessor']])
    func = locals().get('dataset_proprocessor')
    dataset = trainer.session.get("dataset")
    try:
        return dataset.apply(func)
    except Exception as e:
        return {"status": False, "message": repr(e)}

# Model endpoints


@lith_model.get("/code")
async def buiild(request: Request) -> types.dict:
    graph = GraphDef(workspace_manager.active.canvas.graph)
    status, message = graph.build()
    if status:
        return {"code": graph.to_code()}
    return await text_response(message)


@lith_model.get("/summary")
async def summary_viewer(request: Request) -> types.dict:
    return {"summary": trainer.summary}

# Train endpoints


@lith_train.post("/start")
async def train_start(request: Request) -> types.dict:
    if trainer.is_training:
        return await json_response({
            "message": "A training session is already running, please wait or stop the session."
        })
    trainer.logs = []
    status, message = trainer.build()
    if not status:
        return {"message": message, "status": status}

    status, message = trainer.compile()
    if not status:
        return {"message": message, "status": status}

    status, message = trainer.start()
    return {"message": message, "status": status}


@lith_train.post("/halt")
async def train_halt(request: Request) -> types.dict:
    data = await request.get_json()
    trainer.halt(state=data['state'])
    return {"status": "Training Halt"}


@lith_train.post("/stop")
async def train_stop(request: Request) -> types.dict:
    try:
        trainer.stop()
        return {"status": True, "message": "Interrupting Training"}
    except AttributeError:
        return {"status": False, "message": "Training hasn't statrted yet."}


@lith_train.get("/status")
async def status(request: Request) -> types.dict:
    return {"logs": trainer.logs}

@lith_train.get("/socket_status")
async def socket_status(request: Request) -> types.websocketserver:
    with WebSocketServer(request) as server:
        logger.log("Status socket initiated.")
        while True:
            data = await server.recv()
            if data  == '$exit':
                break
            await server.send_json(trainer.logs)
            sleep(0.005)
    logger.success("Status socket closed.")

# custom node endpoints

@lith_custom.post("/node/build")
async def node_build(request: Request) -> types.dict:
    data = await request.get_json()
    (function_id, function), = generate_args(data['code']).items()
    fullspecs = inspect.getfullargspec(function)
    arguments = {}

    for arg, val in zip(fullspecs.args, fullspecs.defaults):
        arguments[arg] = {
            "value": val,
            "type": fullspecs.annotations[arg].__name__,
            "render": "text",
            "options": None,
        }
    return {"id": function_id, "arguments": arguments}


app.add_lith(lith_sys)
app.add_lith(lith_workspace)
app.add_lith(lith_dataset)
app.add_lith(lith_model)
app.add_lith(lith_train)

if __name__ == "__main__":
    app.serve(
        port=8000,
    )
