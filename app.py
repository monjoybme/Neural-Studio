import inspect
import re
from sys import flags, modules, path
import zipfile

from tf_gui.web import App, Request, mime_types, text_response, json_response
from tf_gui.web.utils import send_file
from tf_gui.web.headers import Header

from tf_gui.builder import build_code
from tf_gui.trainer import Trainer
from tf_gui.manage import Workspace, WorkspaceManager

from json import dump, JSONDecodeError
from os import chdir, path as pathlib, mkdir
from shutil import rmtree
from glob import glob


ROOT_PATH = pathlib.abspath("./")

app = App()
workspace_mamager = WorkspaceManager()
trainer = Trainer(workspace_mamager)

def generate_args(code) -> dict:
    exec(code)
    ret = locals()
    ret.pop("code")
    return ret

def download_json(workspace: Workspace, trainer: Trainer):
    model = trainer.get_model()
    if not model:
        if trainer.build_model(workspace.var_graphdef):
            model = trainer.get_model()
        else:
            return {
                "message":trainer.logs[-1],
                "status":False
            }

    with open(pathlib.join(workspace.path, 'outputs', 'model.json'), "w+") as file:
        file.write(model.to_json())
    return {
        "message":"Downloading Model",
        "status":True
    }

def download_json_w(workspace: Workspace, trainer: Trainer):
    temp_dir = pathlib.join(workspace.path, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    model = trainer.get_model()
    if not model:
        if trainer.build_model(workspace.var_graphdef):
            model = trainer.get_model()
        else:
            return {
                "message":trainer.logs[-1],
                "status":False
            }

    with open(pathlib.join(temp_dir, 'model.json'), "w+") as file:
        file.write(model.to_json())
    model.save_weights(pathlib.join(temp_dir, 'model'))
    chdir(pathlib.join(workspace.path, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
    chdir(ROOT_PATH)
    return {
        "message":"Downloading Model",
        "status":True
    }

def download_pb(workspace: Workspace, trainer: Trainer):
    temp_dir = pathlib.join(workspace.path, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    model = trainer.get_model()
    if not model:
        if trainer.build_model(workspace.var_graphdef):
            model = trainer.get_model()
        else:
            return {
                "message":trainer.logs[-1],
                "status":False
            }
    model.save(temp_dir)
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
        "message":"Downloading Model",
        "status":True
    }

def download_hdf5(workspace: Workspace, trainer: Trainer):
    temp_dir = pathlib.join(workspace.path, "outputs", "model.hdf5")
    model = trainer.get_model()
    if not model:
        if trainer.build_model(workspace.var_graphdef):
            model = trainer.get_model()
        else:
            return {
                "message":trainer.logs[-1],
                "status":False
            }
    model.save(temp_dir)
    return {
        "message":"Downloading Model",
        "status":True
    }

download_options = {
    "json": download_json,
    "json_w": download_json_w,
    "pb": download_pb,
    "hdf5": download_hdf5
}


@app.route("/workspace/active",)
async def workspace(request: Request,):
    if request.header.method == "GET":
        return json_response({
            "data": workspace_mamager.active_workspace.get(),
        }, )

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)

@app.route("/workspace/open/<string:name>",)
async def workspace_open(request: Request,name:str):
    if request.header.method == "POST":
        return json_response({
            "status": bool(workspace_mamager.open_workspace(name)),
        }, )

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)

@app.route("/workspace/delete/<string:name>",)
async def workspace_new(request: Request, name:str):
    if request.header.method == "POST":
        return json_response({
            "status": workspace_mamager.delete_workspace(name),
        },)

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/recent",)
async def workspace_recent(request: Request,):
    if request.header.method == "GET":
        return json_response({
            "data": workspace_mamager.cache.recent,
        },)

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/all",)
async def workspace_all(request: Request,):
    if request.header.method == "GET":
        return json_response({
            "data": workspace_mamager.get(),
        },)

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)


@app.route("/workspace/autosave",)
async def workspace_autosave(request: Request,):
    if request.header.method == "POST":
        data = await request.get_json()
        workspace_mamager.active_workspace.set(**data)
        workspace_mamager.active_workspace.save()
        return json_response({
            "data": workspace_mamager.get(),
        },)

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)

@app.route("/workspace/new",)
async def workspace_new(request: Request,):
    if request.header.method == "POST":
        data = await request.get_json()
        workspace_mamager.new_workspace(**data)
        return json_response({
            "data": workspace_mamager.active_workspace.get(),
        },)

    return json_response({
        "message": "Method Not Allowed !"
    }, status_code=400)



@app.route("/build",)
async def buiild(request: Request):
    if request.header.method == 'POST':
        try:
            build_config = await request.get_json()
            with open("./data/example_build.json", "w+") as file:
                dump(build_config, file,)
            _, code = build_code(build_config)
            return json_response({
                "status": 200,
                "code": code
            })

        except NameError as e:
            return json_response({
                "status": 200,
                "code": f"""Error : {str(e)}"""
            })
    else:
        return json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/status")
async def status(request: Request):
    return json_response({
        "status": True,
        "logs": trainer.logs
    })


@app.route("/download/<string:name>")
async def download_name(request: Request, name: str):
    if request.header.method == 'GET':
        return await send_file(
            pathlib.join(
                workspace_mamager.active_workspace.path,
                "outputs",
                name
            ),
            request=request
        )

    return json_response({
        "message": "Method Not Allowed",
    }, status_code=400)


@app.route("/download",)
async def download_model(request: Request):
    if request.header.method == 'POST':
        data = await request.get_json()
        prep_func = download_options[data['format']]
        status = prep_func(workspace_mamager.active_workspace, trainer)
        return json_response(status)

    return json_response({
        "message": "Method Not Allowed",
    }, status_code=400)


@app.route("/model/summary",)
async def summary_viewer(request: Request):
    if request.header.method == 'POST':
        try:
            return json_response({
                "status": 200,
                "summary": trainer.summary
            })
        except JSONDecodeError:
            return json_response(
                data={"message": "Can't read graph !"},
                status_code=200,
                message="Method Not Allowed !"
            )

    else:
        return json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/train/start",)
async def train_start(request: Request):
    if request.header.method == 'POST':
        try:
            trainer.logs = []
            trainer.build_session()
            trainer.compile_model()
            trainer.start()
            return json_response({
                "status": "Training Started"
            })
        except JSONDecodeError:
            return json_response(
                data={"message": "Can't read graph !"},
                status_code=200,
                message="Method Not Allowed !"
            )

    else:
        return json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/train/halt",)
async def train_halt(request: Request):
    if request.header.method == 'POST':
        data = await request.get_json()
        trainer.halt(state=data['state'])
        return json_response({
            "status": "Training Halt"
        })

    else:
        return json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/train/stop",)
async def train_stop(request: Request):
    if request.header.method == 'POST':
        try:
            trainer.stop()
            return json_response({
                "status": 200,
                "message": "Interrupting Training"
            })
        except AttributeError:
            return json_response({
                "status": 200,
                "message": "Training hasn't statrted yet."
            })

    else:
        return json_response(
            data={"message": "Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/node/build")
async def node_build(request: Request):
    if request.header.method == "POST":
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
        return json_response({
            "status": 200,
            "id": function_id,
            "arguments": arguments
        })

    return json_response({
        "message": "Method not allowed",
    }, status_code=400)


@app.route("/<string:t>")
async def test(request:Request, t:str):
    return text_response(t)

if __name__ == "__main__":
    app.serve(
        port=80
    )

