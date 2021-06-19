import inspect
import re
import zipfile
import base64

import cv2
import pandas as pd
import numpy as np
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers, callbacks, optimizers, losses, applications

from glob import glob
from gc import collect
from concurrent.futures import ThreadPoolExecutor
from os import path as pathlib, listdir
from tqdm.cli import tqdm
from sklearn.model_selection import train_test_split

from studio.web import App, Request, json_response, text_response, send_file
from studio.trainer import Trainer
from studio.manage import Workspace, WorkspaceManager
from studio.graph import GraphDef
from studio.dataset import DATASETS, Dataset
from studio.structs import DataDict
from studio.utils import download_options, generate_args


# root path
ROOT_PATH = pathlib.abspath("./")

# defining globals
app = App()
workspace_manager = WorkspaceManager()
trainer = Trainer(workspace_manager)

# updating training session 
trainer.update_session(globals())

# loading dataset from cached data 
try:
    Dataset = DATASETS.get(workspace_manager.active.dataset[['meta:type']])
    dataset = Dataset(**workspace_manager.active.dataset.to_dict())
    exec(workspace_manager.active[['dataset:meta:preprocessor']])
    func = locals().get('dataset_proprocessor')
    try:
        dataset.apply(func)
    except Exception as e:
        print (f"[warning] {e}")
    trainer.update_session({
        "dataset": dataset
    })
except AttributeError:
    print ("[warning] Error updating dataset.")
except KeyError:
    print ("[warning] Error updating dataset.")

# sys endpoints

@app.route("/sys/path")
async def sys_path(request: Request)->dict:
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

# Workspace Endpoints

@app.route("/workspace/active")
async def workspace_active(request: Request)->dict:
    return {
        "data": workspace_manager.active.to_dict()
    }


@app.route("/workspace/active/<str:var>")
async def workspace_active_var(request: Request, var: str)->dict:
    if request.headers.method == "GET":
        return workspace_manager.active[var].to_dict()
    elif request.headers.method == 'POST':
        try:
            var_data = await request.get_json()
            workspace_manager.active[var] = var_data
            return { "status": True }
        except Exception as e:
            return { "status": False, "message": str(e) }
    else:
        return { "message": "Method Not Allowed !" }


@app.route("/var/<path:key>")
async def workspace_active_var_key(request: Request, key: str)->dict:
    if request.headers.method == 'GET':
        try:
            var = workspace_manager.active[[key.replace("/var/", "").replace("/", ":")]]
            return { "data": var.to_dict() if isinstance(var, DataDict) else var }
        except KeyError:
            return { "data": None }
    elif request.headers.method == 'POST':
        pass

@app.route("/workspace/recent")
async def workspace_recent(request: Request)->dict:
    return {"data": workspace_manager.cache.recent}

@app.route("/workspace/all")
async def workspace_all(request: Request)->dict:
    return workspace_manager.get_workspaces()

@app.route("/workspace/new")
async def workspace_new(request: Request)->dict:
    data = await request.get_json()
    workspace = workspace_manager.new_workspace(**data)
    assert workspace.idx == workspace_manager.active.idx
    return {
        "status": True
    }

@app.route("/workspace/open/<str:name>")
async def workspace_open(request: Request, name: str)->dict:
    workspace_manager.open_workspace(name)
    assert workspace_manager.active.idx == name
    return {
        "status": True,
    }

@app.route("/workspace/delete/<str:name>")
async def workspace_new(request: Request, name: str)->dict:
    return {
        "status": workspace_manager.delete_workspace(name),
    }


# download endpoints

# @app.route("/download")
# async def download_model(request: Request)->dict:
#     if request.headers.method == 'POST':
#         data = await request.get_json()
#         prep_func = download_options[data['format']]
#         status = prep_func(workspace_manager.active, trainer)
#         return await json_response(status)

#     return await json_response({
#         "message": "Method Not Allowed",
#     }, status_code=400)


# @app.route("/download/<str:name>")
# async def download_name(request: Request, name: str)->dict:
#     if request.headers.method == 'GET':
#         return await send_file(
#             pathlib.join(
#                 workspace_manager.active.path,
#                 "outputs",
#                 name
#             ),
#             request=request
#         )

#     return await json_response({
#         "message": "Method Not Allowed",
#     }, status_code=400)


# dataset endpoints

@app.route("/dataset/add")
async def dataset_init(request: Request)->dict:
    data = await request.get_json()
    dataset = DATASETS.get(data['meta']['type'])(**data)
    trainer.update_session({
        "dataset":dataset
    })
    return {
        "sample": dataset.sample()
    }

@app.route("/dataset/preprocess")
async def dataset_preprocess(request: Request)->dict:
    exec(workspace_manager.active[['dataset:meta:preprocessor']])
    func = locals().get('dataset_proprocessor')
    dataset = trainer.session.get("dataset")
    try:
        return dataset.apply(func)
    except Exception as e:
        return { "status": False, "message": str(e) }

# model api endpoints

@app.route("/model/code")
async def buiild(request: Request)->dict:
    graph = GraphDef(workspace_manager.active.canvas.graph)
    status, message = graph.build()
    if status:
        return { "code": graph.to_code() }
    return await text_response(message)    


@app.route("/model/summary")
async def summary_viewer(request: Request)->dict:
    return { "summary": trainer.summary }


# training endpoints


@app.route("/train/start")
async def train_start(request: Request)->dict:
    if trainer.is_training:
        return await json_response({
            "message": "A training session is already running, please wait or stop the session."
        })
    trainer.logs = []
    
    status, message = trainer.build()
    if not status:
        return { "message": message, "status": status }
    
    status,message = trainer.compile()
    if not status:
        return { "message": message, "status": status }
    
    status, message = trainer.start()
    return {"message": message, "status": status}

# @app.route("/train/halt")
# async def train_halt(request: Request):
#     if request.headers.method == 'POST':
#         data = await request.get_json()
#         trainer.halt(state=data['state'])
#         return await json_response({
#             "status": "Training Halt"
#         })

#     else:
#         return await json_response(
#             data={"message": "Method Not Allowed"},
#             status_code=401,
#             message="Method Not Allowed !"
#         )


# @app.route("/train/stop")
# async def train_stop(request: Request):
#     if request.headers.method == 'POST':
#         try:
#             trainer.stop()
#             return await json_response({
#                 "status": 200,
#                 "message": "Interrupting Training"
#             })
#         except AttributeError:
#             return await json_response({
#                 "status": 200,
#                 "message": "Training hasn't statrted yet."
#             })

#     else:
#         return await json_response(
#             data={"message": "Method Not Allowed"},
#             status_code=401,
#             message="Method Not Allowed !"
#         )


@app.route("/train/status")
async def status(request: Request)->dict:
    return { "logs": trainer.logs }

# # custom node endpoints


# @app.route("/custom/node/build")
# async def node_build(request: Request):
#     if request.headers.method == "POST":
#         data = await request.get_json()
#         (function_id, function), = generate_args(data['code']).items()
#         fullspecs = inspect.getfullargspec(function)
#         arguments = {}

#         for arg, val in zip(fullspecs.args, fullspecs.defaults):
#             arguments[arg] = {
#                 "value": val,
#                 "type": re.sub("(<)|(>)|(')|(class)|( )", "", str(fullspecs.annotations[arg])),
#                 "render": "text",
#                 "options": None,

#             }

#         return await json_response({
#             "id": function_id,
#             "arguments": arguments
#         })

#     return await json_response({
#         "message": "Method not allowed",
#     }, status_code=400)


if __name__ == "__main__":
    app.serve(
        port=80,
    )
