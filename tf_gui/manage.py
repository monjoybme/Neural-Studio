from os import name, path as pathlib, mkdir, chdir, listdir
from json import dump, load
from typing import List, Set
from shutil import rmtree

from .utils import Dict
from .graph import GraphDef

DEFAULT_CONFIG = Dict({'name': 'model', "description": 'Model Description !'})
DEFAULT_GRAPHDEF = Dict({
    'train_config': {
        'session_id': None,
        'compile': None,
        'model': None,
    }
})
DEFAULT_CANVAS_CONFIG = Dict({
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
    "customNodes":{
        "definitions":[]
    }
})
DEFAULT_APP_CONFIG = Dict({
    "theme": "light",
    "geometry": {
        "sideBar": {
            "width": 70
        },
        "topBar": {
            "height": 60
        }
    },
    "canvas": {
        "toolbar": {
            "width": 240,
        }
    },
    "monitor": {
        "width": 400,
        "padding": 5,
        "graph": {
            "height": 295,
            "width": 365
        }
    }
})


class Cache(object):
    def __init__(self, root: str):
        self.__dict__.update(dict(
            recent=[None for _ in range(10)],
        ))

        self.__cache_file__ = pathlib.join(root, "cache.json")
        if not pathlib.isfile(self.__cache_file__):
            with open(self.__cache_file__, "w+") as file:
                dump(self.__dict__, file)

    def __write__(self,):
        with open(self.__cache_file__, "w+") as file:
            dump(dict([(key, val) for key, val in self.__dict__.items()
                       if not key.startswith("__")]), file)

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


class Workspace(Dict):
    __required__vars__ = [
        ('config',  DEFAULT_CONFIG),
        ('graphdef', DEFAULT_GRAPHDEF),
        ('canvas_config', DEFAULT_CANVAS_CONFIG),
        ('app_config', DEFAULT_APP_CONFIG),
    ]

    var_config = DEFAULT_CONFIG
    var_graphdef = DEFAULT_GRAPHDEF
    var_canvas_config = DEFAULT_CANVAS_CONFIG
    var_app_config = DEFAULT_APP_CONFIG

    def __init__(self, path: str):
        self.__path__ = path
        if not pathlib.isdir(self.__path__):
            mkdir(self.__path__)
        *_, self.__name__ = pathlib.split(self.__path__)
        for var, val in self.__required__vars__:
            file = pathlib.join(self.__path__, f"{var}.json")
            if pathlib.isfile(file,):
                with open(file, "r") as file:
                    self.__dict__[f"var_{var}"] = load(file,)
            else:
                with open(file, "w+") as file:
                    if var == 'config':
                        val['name'] = self.__name__
                    dump(val.full_dict, file)
                self.__dict__[f"var_{var}"] = val

        super().__init__()

    def __repr__(self,):
        return f"""Workspace(\n\tname={self.__name__},\n\tpath={self.__path__}\n)"""

    def save(self,):
        for var, val in self.get_vars():
            with open(pathlib.join(self.__path__, f"{var}.json"), "w+") as file:
                dump(val, file)

    def set(self, **kwargs):
        for key, val in kwargs.items():
            self.__dict__[f"var_{key}"] = val

    def get_vars(self, ) -> iter:
        for key, val in self.full_dict.items():
            if key.startswith("var"):
                yield key.replace("var_", ''), val

    def get_var_dict(self, ) -> dict:
        return dict(self.get_vars())


class WorkspaceManager(Dict):
    workspaces: Set[str] = set()

    def __init__(self, root='.tfstudio'):
        self.root = pathlib.abspath(root)
        if not pathlib.isdir(self.root):
            mkdir(self.root)
            mkdir(pathlib.join(self.root, "models"))
            mkdir(pathlib.join(self.root, "workspace"))
            mkdir(pathlib.join(self.root, "extentions"))

        self.cache = Cache(self.root)
        self.active = False
        for w in listdir(pathlib.join(self.root, "workspace")):
            w_path = pathlib.join(self.root, "workspace", w)
            if pathlib.isdir(w_path):
                self.workspaces.add(w)
                if w == self.cache.last:
                    self.active = Workspace(w_path)

        if not self.active:
            self.active = Workspace(pathlib.join(self.root, "workspace", "model"))
            self.workspaces.add(self.active.idx)
            self.cache >> self.active.idx

    def __repr__(self,):
        return f"""WorkspaceManager @ {self.root}"""

    def __iter__(self,):
        for w in self.workspaces:
            yield w

    def new_workspace(self, name: str) -> Workspace:
        workspace = Workspace(
            path=pathlib.join(self.root, "workspace", name)
        )
        self.workspaces.add(workspace.idx)
        self.cache >> workspace.idx
        self.active = workspace
        return workspace

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
            return workspace
        return workspace

    def delete_workspace(self, name: str) -> None:
        path = pathlib.join(self.root, "workspace", name)
        if pathlib.isdir(path,):
            while self.cache.last == name:
                self.cache << name
            self.workspaces = {w for w in self.workspaces if pathlib.join(
                self.root, "workspace", w) != path}
            rmtree(path,)

            if self.active[['var_config:name']] == name:
                self.active = self.open_workspace(self.cache.last)
                if not self.active:
                    self.active = self.new_workspace("model")
            return True
        return False

    def get_workspaces(self,):
        return [{"name": w} for w in self.workspaces]
