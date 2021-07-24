from os import path as pathlib, mkdir, chdir, listdir
from json import dump, load, loads
import shutil
from typing import Set
from shutil import rmtree

from .structs import DataDict
from .graph import DatasetDef, GraphDef
from .abc import AbsDataset
from .logging import Logger
from .data import setup

APP = DataDict({
    "theme": "light",
    "name": "model",
    "global": {
        "topbar": {
            "height": 60,
        },
        "sidebar": {
            "width": 60
        }
    }
})

HOME = DataDict({
    "active": {
        "name": "model",
    },
    "your_work": []
})

CANVAS = DataDict({
    "activeLayer": None,
    "activeLine": None,
    "newEdge": None,
    "pos": None,
    "lineCount": None,
    "layerCount": dict(),
    "mode": "normal",
    "pan": False,
    "panLast": None,
    "viewBox": {
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    },
    "graph": {
        "nodes": {

        },
        "train_config": {
            "session_id": None,
            "model": None,
            "compile": None,
            "fit": None,
            "optimizer": None,
            "loss": None,
            "dataset": None
        },
        "custom_nodes": [

        ],
    }
})


DATASET = DataDict({
    "activeLayer": None,
    "activeLine": None,
    "newEdge": None,
    "pos": None,
    "lineCount": None,
    "layerCount": dict(),
    "mode": "normal",
    "pan": False,
    "panLast": None,
    "viewBox": {
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
    },
    "graph": {
        "nodes": {

        },
        "train_config": {
            "session_id": None,
            "model": None,
            "compile": None,
            "fit": None,
            "optimizer": None,
            "loss": None,
            "dataset": None
        },
        "custom_nodes": [

        ],
    }
})


TRAIN = DataDict({
    "logs": []
})


class Cache(object):
    """
    Cache object.
    """
    recent = [None for _ in range(10)]

    def __init__(self, root: str):
        """
        Args:
            root: path to cache file
        """
        self.__cache_file__ = pathlib.join(root, "cache.json")

        if not pathlib.isfile(self.__cache_file__):
            with open(self.__cache_file__, "w+") as file:
                dump(self.recent, file)

        with open(self.__cache_file__, "r") as cache:
            self.recent = load(cache)

    def __write__(self,):
        with open(self.__cache_file__, "w+") as file:
            dump(self.recent, file)

    def __getitem__(self, key):
        return self.__dict__[key]

    def __rshift__(self, other: str):
        self.recent[1:] = self.recent[:-1]
        self.recent[0] = other
        self.__write__()

    def __lshift__(self, other: str):
        self.recent[:-1] = self.recent[1:]
        self.recent[-1] = other
        self.recent = [r for r in self.recent if r != other]
        self.recent += [None for i in range(10-len(self.recent))]
        self.__write__()

    @property
    def last(self,):
        return self.recent[0]


class Workspace(DataDict):
    __required__vars__ = [
        ('app', APP),
        ('home', HOME),
        ('dataset', DATASET),
        ('canvas', CANVAS),
        ('train', TRAIN)
    ]
    __vars__ = ['app', 'home',  'dataset', 'canvas',  'train']

    app = APP
    home = HOME
    dataset = DATASET
    canvas = CANVAS
    train = TRAIN

    def __init__(self, path: str, metadata: dict = {}):
        self.__path__ = path
        *_, self.__name__ = pathlib.split(self.__path__)

        if not pathlib.isdir(self.__path__):
            mkdir(self.__path__)
            for var, val in self.__required__vars__:
                file = pathlib.join(self.__path__, f"{var}.json")
                if var == 'home':
                    val[['active:name']] = self.__name__
                if var == 'app':
                    val['name'] = self.__name__
                    val['config'] = metadata
                with open(file, "w+") as file:
                    dump(val.to_dict(), file)

        for var in self.__vars__:
            file = pathlib.join(self.__path__, f"{var}.json")
            with open(file, "r") as file:
                self.__dict__[f"{var}"] = DataDict(load(file,))

        super().__init__()

    def __repr__(self,):
        return f"""Workspace(\n\tname={self.__name__},\n\tpath={self.__path__}\n)"""

    def __setitem__(self, key: str, val: dict):
        if isinstance(key, list):
            super().__setitem__(key, val)
            keys, = key
            key, *_ = keys.split(":")
        else:
            assert key in self.__vars__, "Please provide valid variable name."
            self.__dict__[key] = DataDict(val)
        with open(pathlib.join(self.__path__, f"{key}.json"), "w+") as file:
            dump(self.__dict__[key].to_dict(), file)

    @property
    def path(self,) -> str:
        return self.__path__

    def save(self,):
        for var, val in self.get_vars():
            with open(pathlib.join(self.__path__, f"{var}.json"), "w+") as file:
                dump(val, file)

    def set(self, **kwargs):
        for key, val in kwargs.items():
            self.__dict__[f"{key}"] = val

    def get_vars(self, ) -> iter:
        yield from self.to_dict().items()

    def get_var_dict(self, ) -> dict:
        return dict(self.get_vars())


class WorkspaceManager(DataDict):

    workspaces: Set[str] = set()
    dataset: DatasetDef = None

    def __init__(self, root='.tfstudio'):
        self.root = pathlib.abspath(root)
        if not pathlib.isdir(self.root):
            mkdir(self.root)
            mkdir(pathlib.join(self.root, "models"))
            mkdir(pathlib.join(self.root, "workspace"))
            mkdir(pathlib.join(self.root, "extentions"))

        self.cache = Cache(self.root)
        self.active = False
        self.logger = Logger("manager")
        self.logger.success(f"Workspace initialized @ {self.root}")

        for w in listdir(pathlib.join(self.root, "workspace")):
            w_path = pathlib.join(self.root, "workspace", w)
            if pathlib.isdir(w_path):
                self.workspaces.add(w)
                if w == self.cache.last:
                    self.active = Workspace(w_path)

        if not self.active:
            self.active = Workspace(pathlib.join(
                self.root, "workspace", "model"))
            self.workspaces.add(self.active.idx)
            print(self.active.idx)
            self.cache >> self.active.idx

    def __repr__(self,):
        return f"""WorkspaceManager @ {self.root}"""

    def __iter__(self,):
        yield from self.workspaces

    def new_workspace(self, data: dict) -> Workspace:
        w_root = pathlib.join(self.root, "workspace", data['name'])
        if pathlib.isdir(w_root):
            return False, f"Workspace '{data['name']}' already exists."
        workspace = Workspace(path=w_root, metadata=data)
        self.workspaces.add(workspace.idx)
        self.cache >> workspace.idx
        self.active = workspace
        self.logger.success(f"create '{data['name']}'")
        return True, workspace

    def open_workspace(self, name: str) -> Workspace:
        workspace = False
        for w in self.workspaces:
            if w == name:
                workspace = Workspace(
                    path=pathlib.join(self.root, "workspace", name)
                )
                break
        if workspace:
            self.active = workspace
            self.cache >> workspace.idx
            self.logger.success(f"open '{name}'")
            return workspace

        self.logger.warning(f"open '{name}'")
        return workspace

    def delete_workspace(self, name: str) -> None:
        path = pathlib.join(self.root, "workspace", name)
        if pathlib.isdir(path,):
            try:
                rmtree(path,)
            except PermissionError:
                return False, "Cannot delete workspace, Another process is using the resource."

            while self.cache.last == name:
                self.cache << name
            self.workspaces = {w for w in self.workspaces if pathlib.join(
                self.root, "workspace", w) != path}
            if self.active[['home:active:name']] == name:
                self.active = self.open_workspace(self.cache.last)
                if not self.active:
                    self.active = self.new_workspace("model")
            return True, f"Workspace deleted successfully."
        return False, f"Error deleting workspace."

    def delete_multiple(self, w_list: list = [], d_all=False):
        if d_all:
            for w in self.workspaces:
                self.delete_workspace(w)
            return True, "All workspaces deleted successully"
        for w in w_list:
            self.delete_workspace(w)
        return True, "Selected workspaces deleted successfully."

    def get_workspaces(self,):
        return [{"name": w} for w in self.workspaces]
