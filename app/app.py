import base64
import inspect
import re
from typing import List, Union
import zipfile

from concurrent.futures import ThreadPoolExecutor
from gc import collect
from glob import glob
from os import listdir, name
from os import path as pathlib
from time import sleep
from pathlib import Path

import cv2
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow import keras
from tensorflow.keras import (applications, callbacks, layers, losses,
                              optimizers)
from tqdm.cli import tqdm

from neural_studio.data import data_path
from neural_studio.graph import DatasetDef, GraphDef
from neural_studio.logging import Logger
from neural_studio.manage import Workspace, WorkspaceManager
from neural_studio.structs import DataDict
from neural_studio.trainer import OutputVisualizer, Trainer
from neural_studio.utils import download_options, generate_args, get_hardware_utilization
from neural_studio.web import App, Lith, Request, json_response, text_response, send_file, types
from neural_studio.web.core.websocket import WebSocketServer
from neural_studio.web.frontend import ServeHTML, ServeStatic


"""
TODO
    1. Document view functions.
"""

# root path
HOME_PATH = Path().home()
ROOT_PATH = pathlib.join(HOME_PATH,".tfstudio")
DATA_PATH = data_path()

# defining globals
app = App()
html_serve = ServeHTML(path= pathlib.join( DATA_PATH, "templates" ))
static_serve = ServeStatic(path= pathlib.join( DATA_PATH, "templates" ))

lith_sys = Lith("sys")
lith_workspace = Lith("workspace")
lith_dataset = Lith("dataset")
lith_model = Lith("model")
lith_train = Lith("train")
lith_custom = Lith("custom")

workspace_manager = WorkspaceManager(root=ROOT_PATH)
trainer = Trainer(workspace_manager)
logger = Logger(name="main")

# updating training session
setattr(callbacks, "OutputVisualizer", OutputVisualizer)
logger.log("updating globals")
trainer.update_session(globals())

try:
    logger.log("Building cached dataset")
    dataset = DatasetDef(workspace_manager[["active:dataset:graph"]])
    status, message = dataset.build()
    if status:
        workspace_manager.dataset = dataset
        trainer.update_session({
            "dataset": dataset.dataset
        })
        logger.success(
            f"Build dataset {{ { dataset.dataset.__class__.__name__ } }}")
    else:
        logger.error(message)
except Exception as e:
    logger.sys_error(e)

@app.get("/",)
async def _index(request: Request) -> types.template:
    return await html_serve.get("index.html")


@app.get("/favicon.ico",)
async def _ico(request: Request) -> types.file:
    return await send_file(pathlib.join(DATA_PATH, "templates", "favicon.ico"), request,dispose= False)

@app.get("/static/<path:file>")
async def _static_view(request: Request, file: Union[str, list]) -> types.static:
    _, *file = file.split("/")
    file = "/".join(file)
    return await static_serve.get(file)

@lith_sys.post("/path")
async def _sys_path(request: Request) -> types.dict:
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


@lith_sys.get("/utilization")
async def _sys_utilization(request: Request) -> types.websocketserver:
    with WebSocketServer(request) as server:
        while True:
            data = await server.recv()
            if data == '$exit':
                break
            await server.send_json(get_hardware_utilization())
            sleep(1)

# Workspace endpoints


@lith_workspace.get("/active")
async def _workspace_active(request: Request) -> types.dict:
    return {"data": workspace_manager.active.to_dict()}


@lith_workspace.get("/active/<str:var>")
async def _workspace_active_var(request: Request, var: str) -> types.dict:
    return workspace_manager.active[var].to_dict()


@lith_workspace.post("/active/<str:var>")
async def _workspace_active_var(request: Request, var: str) -> types.dict:
    var_data = await request.get_json()
    workspace_manager.active[var] = var_data
    return {"status": True}


@lith_workspace.get("/var/<path:key>")
async def _workspace_active_var_key(request: Request, key: str) -> types.dict:
    try:
        var = workspace_manager.active[[
            key.replace("/var/", "").replace("/", ":")]]
        return {"data": var.to_dict() if isinstance(var, DataDict) else var}
    except KeyError:
        return {"data": None}


@lith_workspace.get("/recent")
async def _workspace_recent(request: Request) -> types.dict:
    return {"data": workspace_manager.cache.recent}


@lith_workspace.get("/all")
async def _workspace_all(request: Request) -> types.dict:
    return workspace_manager.get_workspaces()


@lith_workspace.post("/new")
async def _workspace_new(request: Request) -> types.dict:
    data = await request.get_json()
    workspace = workspace_manager.new_workspace(**data)
    assert workspace.idx == workspace_manager.active.idx
    return {
        "status": True
    }


@lith_workspace.post("/open/<str:name>")
async def _workspace_open(request: Request, name: str) -> types.dict:
    workspace_manager.open_workspace(name)
    assert workspace_manager.active.idx == name
    return {
        "status": True,
    }


@lith_workspace.post("/delete/<str:name>")
async def _workspace_new(request: Request, name: str) -> types.dict:
    return {
        "status": workspace_manager.delete_workspace(name),
    }


# download endpoints

@lith_workspace.post("/download")
async def _download_model(request: Request) -> types.dict:
    data = await request.get_json()
    prep_func = download_options[data['format']]
    return prep_func(workspace_manager.active, trainer)


@lith_workspace.get("/download/<str:name>")
async def _download_name(request: Request, name: str) -> types.file:
    return await send_file(
        pathlib.join(
            workspace_manager.active.__path__,
            "outputs",
            name
        ),
        request=request
    )


# Dataset endpoints

@lith_dataset.get("/build")
async def _dataset_build(request: Request) -> types.dict:
    try:
        dataset = DatasetDef(workspace_manager[["active:dataset:graph"]])
        status, message = dataset.build()
        if not status:
            return {
                "status": status,
                "message": message
            }

        workspace_manager.dataset = dataset
        trainer.update_session({
            "dataset": dataset.dataset
        })
        logger.success(f"Build dataset {{ { dataset.dataset.__class__.__name__ } }}")
        return {"status": True, "message": "Dataset Built Succesfully" }
    except Exception as e:
        return {"status": False, "message": repr(e)}


@lith_dataset.get("/sample")
async def _dataset_sample(request: Request) -> types.dict:
    return workspace_manager.dataset.dataset.sample(10)

# Model endpoints


@lith_model.get("/code")
async def _buiild(request: Request) -> types.dict:
    graph = GraphDef(workspace_manager.active.canvas.graph)
    status, message = graph.build()
    if status:
        return {"code": graph.to_code()}
    return await text_response(message)


@lith_model.get("/summary")
async def _summary_viewer(request: Request) -> types.dict:
    return {"summary": trainer.summary}

# Train endpoints


@lith_train.post("/start")
async def _train_start(request: Request) -> types.dict:
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
async def _train_halt(request: Request) -> types.dict:
    data = await request.get_json()
    trainer.halt(state=data['state'])
    return {"status": "Training Halt"}


@lith_train.post("/stop")
async def _train_stop(request: Request) -> types.dict:
    try:
        trainer.stop()
        return {"status": True, "message": "Interrupting Training"}
    except AttributeError:
        return {"status": False, "message": "Training hasn't statrted yet."}


@lith_train.get("/status")
async def _status(request: Request) -> types.dict:
    return {"logs": trainer.logs}

@lith_train.get("/socket_status")
async def _socket_status(request: Request) -> types.websocketserver:
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
async def _node_build(request: Request) -> types.dict:
    data = await request.get_json()
    (function_id, function), = generate_args(data['code']).items()
    fullspecs = inspect.getfullargspec(function)
    arguments = {
        arg: {
            "value": val,
            "type": fullspecs.annotations[arg].__name__,
            "render": "text",
            "options": None,
        } 
            for arg, val 
            in zip(fullspecs.args, fullspecs.defaults)
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
