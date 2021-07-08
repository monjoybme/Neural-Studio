import zipfile

from os import path as pathlib, mkdir, chdir
from shutil import rmtree
from glob import glob

class Workspace:
    pass

class Trainer:
    pass

def generate_args(code: str) -> dict:
    exec(code,)
    ret = locals()
    ret.pop("code")
    return ret


def download_json(workspace: Workspace, trainer: Trainer) -> dict:
    temp_dir = pathlib.join(workspace.__path__, "outputs")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    with open(pathlib.join(workspace.__path__, 'outputs', 'model.json'), "w+") as file:
        file.write(trainer.model.to_json())
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_json_w(workspace: Workspace, trainer: Trainer) -> dict:
    temp_dir = pathlib.join(workspace.__path__, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)

    with open(pathlib.join(temp_dir, 'model.json'), "w+") as file:
        file.write(trainer.model.to_json())
    trainer.model.save_weights(pathlib.join(temp_dir, 'model'))
    chdir(pathlib.join(workspace.__path__, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
    # chdir(globals().get("ROOT_PATH"))
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_pb(workspace: Workspace, trainer: Trainer) -> dict:
    temp_dir = pathlib.join(workspace.__path__, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    trainer.model.save(temp_dir)
    chdir(pathlib.join(workspace.__path__, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
        for f in glob("./assets/*"):
            zfile.write(f)
        for f in glob("./variables/*"):
            zfile.write(f)
    
    # chdir(globals().get("ROOT_PATH"))
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_hdf5(workspace: Workspace, trainer: Trainer) -> dict:
    temp_dir = pathlib.join(workspace.__path__, "outputs", "model.hdf5")
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
