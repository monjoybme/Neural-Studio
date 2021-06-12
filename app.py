import inspect
import re
import zipfile

from studio.web import App, Request, json_response, text_response, send_file
from studio.trainer import Trainer
from studio.manage import Workspace, WorkspaceManager
from studio.graph import GraphDef
from studio.dataset import DATASETS, Dataset
from studio.structs import DataDict
from studio.utils import download_options, generate_args

from tensorflow import keras
from sklearn.model_selection import train_test_split

from os import  path as pathlib, listdir

# root path
ROOT_PATH = pathlib.abspath("./")

app = App()
workspace_mamager = WorkspaceManager()
trainer = Trainer(workspace_mamager)

try:
    Dataset = DATASETS.get(workspace_mamager.active.dataset['meta']['type'])
    workspace_mamager.dataset = Dataset(**workspace_mamager.active.dataset.full_dict)
except AttributeError:
    print ("[warning] Error updating dataset.")
except KeyError:
    print ("[warning] Error updating dataset.")


globals().update({
    "__tfgui__globals__": DataDict({
        "workspace_manager": workspace_mamager
    })
})

# Workspace Endpoints

@app.route("/workspace/active")
async def workspace_active(request: Request)->dict:
    return {
        "data": workspace_mamager.active.to_dict()
    }


@app.route("/workspace/active/<str:var>")
async def workspace_active_var(request: Request, var: str)->dict:
    if request.headers.method == "GET":
        return workspace_mamager.active[var].to_dict()
    elif request.headers.method == 'POST':
        try:
            var_data = await request.get_json()
            workspace_mamager.active[var] = var_data
            return { "status": True }
        except Exception as e:
            return { "status": False, "message": str(e) }
    else:
        return { "message": "Method Not Allowed !" }


@app.route("/var/<path:key>")
async def workspace_active_var_key(request: Request, key: str)->dict:
    if request.headers.method == 'GET':
        try:
            var = workspace_mamager.active[[key.replace("/var/", "").replace("/", ":")]]
            return { "data": var.to_dict() if isinstance(var, DataDict) else var }
        except KeyError:
            return { "data": None }
    elif request.headers.method == 'POST':
        pass

@app.route("/workspace/recent")
async def workspace_recent(request: Request)->dict:
    return {"data": workspace_mamager.cache.recent}

@app.route("/workspace/all")
async def workspace_all(request: Request)->dict:
    return workspace_mamager.get_workspaces()

@app.route("/workspace/new")
async def workspace_new(request: Request)->dict:
    data = await request.get_json()
    workspace = workspace_mamager.new_workspace(**data)
    assert workspace.idx == workspace_mamager.active.idx
    return {
        "status": True
    }

@app.route("/workspace/open/<str:name>")
async def workspace_open(request: Request, name: str)->dict:
    workspace_mamager.open_workspace(name)
    assert workspace_mamager.active.idx == name
    return {
        "status": True,
    }

@app.route("/workspace/delete/<str:name>")
async def workspace_new(request: Request, name: str)->dict:
    if request.headers.method == "POST":
        return await json_response({
            "status": workspace_mamager.delete_workspace(name),
        })

    return await json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)

# download endpoints

# @app.route("/download")
# async def download_model(request: Request)->dict:
#     if request.headers.method == 'POST':
#         data = await request.get_json()
#         prep_func = download_options[data['format']]
#         status = prep_func(workspace_mamager.active, trainer)
#         return await json_response(status)

#     return await json_response({
#         "message": "Method Not Allowed",
#     }, status_code=400)


# @app.route("/download/<str:name>")
# async def download_name(request: Request, name: str)->dict:
#     if request.headers.method == 'GET':
#         return await send_file(
#             pathlib.join(
#                 workspace_mamager.active.path,
#                 "outputs",
#                 name
#             ),
#             request=request
#         )

#     return await json_response({
#         "message": "Method Not Allowed",
#     }, status_code=400)


# # model api endpoints

# @app.route("/model/code")
# async def buiild(request: Request):
#     if request.headers.method == 'GET':
#         graph = GraphDef(workspace_mamager.active.graph)
#         status, message = graph.build()
#         if status:
#             return await text_response(graph.to_code())
#         return await text_response(message)
#     return await json_response(
#         data={
#             "message": "Method Not Allowed"
#         },
#     )


# @app.route("/model/summary")
# async def summary_viewer(request: Request):
#     if request.headers.method == 'GET':
#         return await json_response({
#             "summary": trainer.summary
#         })
#     return await json_response({
#         "message": "Method Not Allowed"
#     }, code=402)

# # dataset api endpoints


# @app.route("/dataset/init")
# async def dataset_init(request: Request):
#     data = await request.get_json()
#     dataset: Dataset = DATASETS[data['meta']['type']]
#     dataset: Dataset = dataset(**data)
#     workspace_mamager.dataset = dataset
#     return await json_response({
#         "sample": dataset.sample()
#     })

# @app.route("/dataset/preprocess")
# async def dataset_preprocess(request: Request):
#     exec(workspace_mamager.dataset.meta['preprocessor'])
#     func = locals()['dataset_proprocessor']
#     try:
#         workspace_mamager.dataset.apply(func)
#         return await json_response({
#             "status": True
#         })
#     except Exception as e:
#         return await json_response({
#             "status": False,
#             "message": str(e)
#         })
    
# @app.route("/dataset/checkpoint")
# async def dataset_checkpoint(request: Request):
#     if request.headers.method == 'POST':
#         data = await request.get_json()
#         dataset = data['dataset']
#         idx = data['id']
#         status, message = trainer.update_dataset(dataset, idx)
#         return await json_response({
#             "message": message,
#             "status": status
#         })

#     return await json_response({
#         "message": "Method Not Allowed."
#     }, code=402)


# @app.route("/dataset/unload")
# async def dataset_checkpoint(request: Request):
#     if request.headers.method == 'POST':
#         status, message = trainer.unload_dataset()
#         return await json_response({
#             "message": message,
#             "status": status
#         })

#     return await json_response({
#         "message": "Method Not Allowed."
#     }, code=402)


# @app.route("/dataset/data")
# async def dataset_checkpoint(request: Request):
#     if request.headers.method == 'POST':
#         data = await request.get_json()
#         return await json_response({
#             "message": data,
#             "status": status
#         })

#     return await json_response({
#         "message": "Method Not Allowed."
#     }, code=402)


# @app.route("/dataset/path")
# async def dataset_checkpoint(request: Request):
#     data = await request.get_json()
#     path = data['path']
#     if not path:
#         return await json_response([])

#     elif pathlib.isfile(path):
#         return await json_response([])

#     elif pathlib.isdir(path):
#         return await json_response(list(map(lambda x: pathlib.join(path, x), listdir(path))))

#     else:
#         d, p = pathlib.split(path)
#         if pathlib.isdir(d):
#             return await json_response(list(map(lambda x: pathlib.join(d, x) if p in x else None, listdir(d))))
#         return await json_response([])

# # training endpoints


# @app.route("/train/start")
# async def train_start(request: Request):
#     if request.headers.method == 'POST':
#         if trainer.isTraining:
#             return await json_response({
#                 "message": "A training session is already running, please wait or stop the session."
#             })
#         trainer.logs = []
#         status, message = trainer.build()
#         if not status:
#             return await json_response({
#                 "message": message,
#                 "status": status
#             })
#         trainer.compile()
#         if not status:
#             return await json_response({
#                 "message": message,
#                 "status": status
#             })
#         trainer.start()
#         return await json_response({
#             "message": "Training Started",
#             "status": True
#         })

#     return await json_response(data={"message": "Method Not Allowed"}, code=402)


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


# @app.route("/train/status")
# async def status(request: Request):
#     return await json_response({
#         "status": True,
#         "logs": trainer.logs
#     })

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
        port=80
    )
