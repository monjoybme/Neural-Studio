import inspect
import re
from sys import flags, modules, path
import zipfile

from tf_gui.web import App, Request, json_response, text_response, send_file

from tf_gui.trainer import Trainer
from tf_gui.manage import Workspace, WorkspaceManager
from tf_gui.graph import GraphDef

from json import dump, JSONDecodeError
from os import chdir, path as pathlib, mkdir
from shutil import register_unpack_format, rmtree
from glob import glob


ROOT_PATH = pathlib.abspath("./")

app = App()
workspace_mamager = WorkspaceManager()
trainer = Trainer(workspace_mamager)

try:
    trainer.update_dataset(from_workspace=True)
except Exception as e:
    print (f'Warning : {e}')
    pass

def generate_args(code) -> dict:
    exec(code)
    ret = locals()
    ret.pop("code")
    return ret


def download_json(workspace: Workspace, trainer: Trainer):
    with open(pathlib.join(workspace.path, 'outputs', 'model.json'), "w+") as file:
        file.write(trainer.model.to_json())
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_json_w(workspace: Workspace, trainer: Trainer):
    temp_dir = pathlib.join(workspace.path, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)

    with open(pathlib.join(temp_dir, 'model.json'), "w+") as file:
        file.write(trainer.model.to_json())
    trainer.model.save_weights(pathlib.join(temp_dir, 'model'))
    chdir(pathlib.join(workspace.path, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
    chdir(ROOT_PATH)
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_pb(workspace: Workspace, trainer: Trainer):
    temp_dir = pathlib.join(workspace.path, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    trainer.model.save(temp_dir)
    chdir(pathlib.join(workspace.path, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
        for f in glob("./assets/*"):
            zfile.write(f)
        for f in glob("./variables/*"):
            zfile.write(f)
    chdir(ROOT_PATH)
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_hdf5(workspace: Workspace, trainer: Trainer):
    temp_dir = pathlib.join(workspace.path, "outputs", "model.hdf5")
    trainer.model.save(temp_dir)
    return {
        "message": "Downloading Model",
        "status": True
    }


download_options = {
    "json": download_json,
    "json_w": download_json_w,
    "pb": download_pb,
    "hdf5": download_hdf5
}

# Workspace Endpoints

@app.route("/workspace/active",)
async def workspace(request: Request,):
    if request.headers.method == "GET":
        return await json_response({
            "data": workspace_mamager.active.get_var_dict(),
        })

    return await json_response({
        "message": "Method Not Allowed !"
    })


@app.route("/workspace/active/var/<str:var>",)
async def workspace(request: Request,var:str ):
    if request.headers.method == "GET":
        return await json_response(workspace_mamager.active[var].full_dict)
    elif request.headers.method == 'POST':
        try:
            var_data = await request.get_json()
            workspace_mamager.active[var] = var_data
            return await json_response({
                "status":True
            })
        except Exception as e:
            return await json_response({
                "status":False
            })
    return await json_response({
        "message": "Method Not Allowed !"
    })

@app.route("/workspace/recent",)
async def workspace_recent(request: Request,):
    if request.headers.method == "GET":
        return await json_response({
            "data": workspace_mamager.cache.recent,
        },)

    return await json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/all",)
async def workspace_all(request: Request,):
    if request.headers.method == "GET":
        return await json_response({
            "data": workspace_mamager.get_workspaces(),
        },)

    return await json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/autosave",)
async def workspace_autosave(request: Request,):
    if request.headers.method == "POST":
        data = await request.get_json()
        workspace_mamager.active.set(**data)
        workspace_mamager.active.save()
        return await json_response({
            "data": workspace_mamager.get_workspaces(),
        })
    return await json_response({
        "message": "Method Not Allowed !"
    })


@app.route("/workspace/new",)
async def workspace_new(request: Request,):
    if request.headers.method == "POST":
        data = await request.get_json()
        w = workspace_mamager.new_workspace(**data)
        assert w.idx == workspace_mamager.active.idx
        return await json_response({
            "status":True
        },)

    return await json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/open/<str:name>",)
async def workspace_open(request: Request, name: str):
    if request.headers.method == "POST":
        workspace_mamager.open_workspace(name)
        assert workspace_mamager.active.idx == name
        return await json_response({
            "status": True,
        },)

    return await json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/delete/<str:name>",)
async def workspace_new(request: Request, name: str):
    if request.headers.method == "POST":
        return await json_response({
            "status": workspace_mamager.delete_workspace(name),
        },)

    return await json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)

# download endpoints

@app.route("/download",)
async def download_model(request: Request):
    if request.headers.method == 'POST':
        data = await request.get_json()
        prep_func = download_options[data['format']]
        status = prep_func(workspace_mamager.active, trainer)
        return await json_response(status)

    return await json_response({
        "message": "Method Not Allowed",
    }, status_code=400)


@app.route("/download/<str:name>")
async def download_name(request: Request, name: str):
    if request.headers.method == 'GET':
        return await send_file(
            pathlib.join(
                workspace_mamager.active.path,
                "outputs",
                name
            ),
            request=request
        )

    return await json_response({
        "message": "Method Not Allowed",
    }, status_code=400)


# model api endpoints

@app.route("/model/code",)
async def buiild(request: Request):
    if request.headers.method == 'GET':
        graph = GraphDef(workspace_mamager.active.graph)
        status, message = graph.build()
        if status:
            return await text_response(graph.to_code())
        return await text_response(message)
    return await json_response(
        data={
            "message": "Method Not Allowed"
        },
    )


@app.route("/model/summary",)
async def summary_viewer(request: Request):
    if request.headers.method == 'GET':
            return await json_response({
                "summary": trainer.summary
            })
    return await json_response({
        "message": "Method Not Allowed"
    },code=402)

# dataset api endpoints


@app.route("/dataset/checkpoint")
async def dataset_checkpoint(request: Request):
    if request.headers.method == 'POST':
        data = await request.get_json()
        dataset = data['dataset']
        idx = data['id']
        status, message = trainer.update_dataset(dataset, idx)
        return await json_response({
            "message":message,
            "status":status
        })

    return await json_response({
        "message": "Method Not Allowed."
    }, code=402)

@app.route("/dataset/unload")
async def dataset_checkpoint(request: Request):
    if request.headers.method == 'POST':
        status, message = trainer.unload_dataset()
        return await json_response({
            "message":message,
            "status":status
        })

    return await json_response({
        "message": "Method Not Allowed."
    }, code=402)

@app.route("/dataset/data")
async def dataset_checkpoint(request: Request):
    if request.headers.method == 'POST':
        data = await request.get_json()
        return await json_response({
            "message":data,
            "status":status
        })

    return await json_response({
        "message": "Method Not Allowed."
    }, code=402)

# training endpoints

@app.route("/train/start",)
async def train_start(request: Request):
    if request.headers.method == 'POST':
        if trainer.isTraining:
            return await json_response({
                "message":"A training session is already running, please wait or stop the session."
            })
        trainer.logs = []
        status, message = trainer.build()
        if not status:
            return await json_response({
                "message": message,
                "status": status
            })
        trainer.compile()
        if not status:
            return await json_response({
                "message": message,
                "status": status
            })
        trainer.start()
        return await json_response({
            "message": "Training Started",
            "status":True
        })

    return await json_response(data={"message": "Method Not Allowed"}, code=402)

@app.route("/train/halt",)
async def train_halt(request: Request):
    if request.headers.method == 'POST':
        data = await request.get_json()
        trainer.halt(state=data['state'])
        return await json_response({
            "status": "Training Halt"
        })

    else:
        return await json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/train/stop",)
async def train_stop(request: Request):
    if request.headers.method == 'POST':
        try:
            trainer.stop()
            return await json_response({
                "status": 200,
                "message": "Interrupting Training"
            })
        except AttributeError:
            return await json_response({
                "status": 200,
                "message": "Training hasn't statrted yet."
            })

    else:
        return await json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/train/status")
async def status(request: Request):
    return await json_response({
        "status": True,
        "logs": trainer.logs
    })

# custom node endpoints

@app.route("/custom/node/build")
async def node_build(request: Request):
    if request.headers.method == "POST":
        data = await request.get_json()
        (function_id, function), = generate_args(data['code']).items()
        fullspecs = inspect.getfullargspec(function)
        arguments = {}

        for arg, val in zip(fullspecs.args, fullspecs.defaults):
            arguments[arg] = {
                "value": val,
                "type": re.sub("(<)|(>)|(')|(class)|( )", "", str(fullspecs.annotations[arg])),
                "render": "text",
                "options": None,

            }

        return await json_response({
            "id": function_id,
            "arguments": arguments
        })

    return await json_response({
        "message": "Method not allowed",
    }, status_code=400)

if __name__ == "__main__":
    app.serve(
        port=80
    )
