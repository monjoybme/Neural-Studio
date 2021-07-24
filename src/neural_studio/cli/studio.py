import inspect
from shutil import ExecError
import sys

from typing import List, Union
from webbrowser import open as open_url
from concurrent.futures import ThreadPoolExecutor
from gc import collect
from glob import glob
from os import listdir, name, path as pathlib
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
from neural_studio.utils import b64_to_numpy_image, download_options, generate_args, get_hardware_utilization

from pyrex import App, Lith, Request, json_response, text_response, send_file, types
from pyrex.core.websocket import WebSocketServer
from pyrex.frontend import ServeHTML, ServeStatic


"""
TODO
    1. Document view functions.
"""


# root path


HOME_PATH = (pathlib.abspath(sys.argv[sys.argv.index("-dir")+1])
             if "-dir" in sys.argv
             else Path().home()
             )

ROOT_PATH = pathlib.join(HOME_PATH, ".tfstudio")
DATA_PATH = data_path()

# app url

HOST = (sys.argv[sys.argv.index("-host")+1]
        if "-host" in sys.argv
        else "localhost"
        )
PORT = (int(sys.argv[sys.argv.index("-port")+1])
        if "-port" in sys.argv
        else 8000
        )

# defining globals
app = App(opendoc=True)
html_serve = ServeHTML(path=pathlib.join(DATA_PATH, "studio"))
static_serve = ServeStatic(path=pathlib.join(DATA_PATH, "studio"))

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

if "--no-cached-model" not in sys.argv:
    # load cached model
    logger.log("loading cached model")
    try:
        trainer._model = keras.models.load_model(
            pathlib.join(workspace_manager.active.path, "last_trained.h5"))
    except Exception as e:
        logger.sys_error(e)       

if "--no-cached-dataset" not in sys.argv:
    try:
        logger.log("Building cached dataset")
        dataset = DatasetDef(workspace_manager[["active:dataset:graph"]])
        status, message = dataset.build()
        if status:
            workspace_manager.dataset = dataset
            trainer.update_session({
                "dataset": dataset.dataset
            })
            trainer.__dataset__ = dataset
            logger.success(
                f"Loaded : {{ { dataset.dataset.__class__.__name__ } }}")
        else:
            logger.error(message)
    except Exception as e:
        logger.sys_error(e)


@app.get("/",)
async def _index(request: Request) -> types.template:
    '''
    index page

    :param request: Request
    :return: template    
    '''
    return await html_serve.get("index.html")


@app.get("/favicon.ico",)
async def _ico(request: Request) -> types.file:
    '''
    favicon
    
    :param request: Request
    :return: file
    '''
    return await send_file(pathlib.join(DATA_PATH, "studio", "favicon.ico"), request, dispose=False)


@app.get("/static/<path:file>")
async def _static_view(request: Request, file: Union[str, list]) -> types.static:
    '''
    static files
    
    :param request: Request
    :param file: path
    :return: static
    '''
    _, *file = file.split("/")
    file = "/".join(file)
    return await static_serve.get(file)

# user endpoints
@app.post("/api/infer")
async def _public_infer(request: Request) -> types.dict:
    """
    Infer a model with a given image
    """
    form = await request.form
    data = workspace_manager.dataset.dataset.pre_process_public(form)
    data = workspace_manager.dataset.dataset.pre_process(data)
    output = trainer.infer(data)
    output = workspace_manager.dataset.dataset.post_inference(output)
    return output


# sys endpoints
@lith_sys.post("/path")
async def _sys_path(request: Request) -> types.dict:
    """
    get the path of the current working directory
    """
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
            await server.sleep(1)

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
    status, workspace = workspace_manager.new_workspace(data)
    if status and workspace.idx == workspace_manager.active.idx:
        return {
            "status": True,
            "message": f"Workspace {data['name']} created successfully."
        }
    return {
        "status": False,
        "message": workspace
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
    status, message = workspace_manager.delete_workspace(name)
    return {
        "status": status,
        "message": message
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
        trainer.__dataset__ = dataset.dataset
        logger.success(
            f"Build dataset {{ { dataset.dataset.__class__.__name__ } }}")
        return {"status": True, "message": "Dataset Built Succesfully"}
    except Exception as e:
        return {"status": False, "message": repr(e)}


@lith_dataset.get("/sample")
async def _dataset_sample(request: Request) -> types.dict:
    try:
        return {
            "status": True,
            "data": workspace_manager.dataset.dataset.sample(20),
        }
    except Exception as e:
        logger.sys_error(e)
        return {"status": False, "message": "Dataset not built yet"}

# Model endpoints


@lith_model.get("/build")
async def _model_build(request: Request) -> types.dict:
    status, message = trainer.build()
    return {
        "status": status,
        "message": message
    }


@lith_model.get("/code")
async def _model_code(request: Request) -> types.dict:
    graph = GraphDef(workspace_manager.active.canvas.graph)
    status, message = graph.build()
    if status:
        return {
            "code": graph.to_code(),
            "status": True,
        }
    return {
        "message": message,
        "status": False
    }

@lith_model.post("/infer")
async def _model_infer(request: Request) -> types.dict:
    data = await request.get_json()
    prediction_data = workspace_manager.dataset.dataset.pre_process(data)
    prediction = trainer.infer(prediction_data)
    response_data = workspace_manager.dataset.dataset.post_inference(
        prediction)
    return {
        "status": True,
        "data": response_data
    }


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
async def _train_stop(request: Request) -> types.dict:
    return {"is_training": trainer.is_training}


@lith_train.get("/socket_status")
async def _socket_status(request: Request) -> types.websocketserver:
    with WebSocketServer(request) as server:
        while True:
            data = await server.recv()
            if data == '$exit':
                break
            await server.send_json(trainer.logs)
            await server.sleep(0.001)

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


def run_studio():
    open_url(f"http://{HOST}:{PORT}")
    app.serve(
        host=HOST,
        port=PORT
    )


if __name__ == "__main__":
    run_studio()
