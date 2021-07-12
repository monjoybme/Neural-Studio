import shutil

from  os import mkdir, path
from pathlib import Path

__all__ = [
    "data_path",
    "setup"
]

def data_path() -> str:
    _path , _ = path.split(__file__)
    return _path

def setup(home: str = None):
    data_root = data_path()
    home = home or path.join(Path().home(), ".tfstudio")
    if path.isdir(home):
        shutil.rmtree(home)
    mkdir(home)
    shutil.copy(
        path.join(data_root, "templates"), 
        path.join(home, "templates")
    )