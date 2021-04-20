from os import path as pathlib, mkdir, chdir, listdir
from json import dump, load
from typing import List, Set
from shutil import rmtree

class Cache(object):
    def __init__(self,root:str):
        self.__dict__.update(dict(
            recent=[ None for _ in range(10)],
        ))
        
        self.__cache_file__ = pathlib.join(root,"cache.json")
        if not pathlib.isfile(self.__cache_file__):
            with open(self.__cache_file__, "w+") as file:
                dump(self.__dict__, file)
        
        with open(self.__cache_file__, "r") as file:
                self.__dict__.update(load(file,))
    
    def __write__(self,):
        with open(self.__cache_file__, "w+") as file:
            dump(dict([ (key, val) for key, val in self.__dict__.items() if not key.startswith("__")]), file)
    
    def __getitem__(self,key):
        return self.__dict__[key]
    
    def __rshift__(self,other:str):
        self.recent[1:] = self.recent[:-1]
        self.recent[0] = other
        self.__write__()
        
    @property
    def last(self,):
        return self.recent[0]
        
class Workspace(object):
    
    required_vars = [
        ( 'config', { 'name':'model', "description":'Model Description !' } ),
        ( 'graphdef', {} ),
        ( 'canvas_config',  
            {
                "activeLayer": None,
                "activeLine":None,
                "newEdge":None,
                "pos":None,
                "lineCount":0,
                "layerCount":{},
                "mode":"normal",
            }
        ),
        ( 'app_config', 
            {
                "theme":"dark",
                "geometry":{
                    "sideBar":{
                        "width":70
                    },
                    "topBar":{
                        "height":60
                    }
                },
                "canvas":{
                    "toolbar":{
                        "width":240,
                    }
                },
                "monitor":{
                    "width":400,
                    "padding":5,
                    "graph":{
                        "height":295,
                        "width":365
                    }
                }
            } 
        ),        
    ]
    
    def __init__(self, path:str):
        self.path = path
        if not pathlib.isdir(self.path):
            mkdir(self.path)
        *_, self.name = pathlib.split(path)
        
        for var, val in self.required_vars:
            file = pathlib.join(self.path,f"{var}.json")
            if pathlib.isfile(file,):
                with open(file,"r") as file:
                    self.__dict__[f"var_{var}"] = load(file,)
            else:
                with open(file,"w+") as file:
                    dump(val, file)
                self.__dict__[f"var_{var}"] = val
                
        
    def __repr__(self,):
        return f"""Workspace(
    name={self.name},
    path={self.path}
)"""
    
    def __getitem__(self,key:str):
        return self.__dict__[f"var_{key}"]
    
    def save(self,):
        for var, val in self.__dict__.items():
            if var.startswith("var_"):
                var = var.replace("var_","")
                with open(pathlib.join(self.path,f"{var}.json"), "w+") as file:
                    dump(val, file)
    
    def set(self,**kwargs):
        for key, val in kwargs.items():
            self.__dict__[f"var_{key}"] = val
    
    def json(self,)->dict:
        return dict([ (key.replace("var_",""), val) for key, val in self.__dict__.items() if key.startswith("var") ])
        
class WorkspaceManager(object):
    
    workspaces:Set[Workspace] = set()
        
    def __init__(self,root='.tfstudio'):
        self.root =  pathlib.abspath(root)
        if not pathlib.isdir(self.root):
            mkdir(self.root)
            mkdir(pathlib.join(self.root,"models"))
            mkdir(pathlib.join(self.root,"workspace"))
            mkdir(pathlib.join(self.root,"extentions"))
            
        self.cache = Cache(self.root)
        
        for w in listdir(pathlib.join(self.root, "workspace")):
            w = pathlib.join(self.root, "workspace", w)
            if pathlib.isdir(w):
                self.workspaces.add(
                    Workspace(
                        path=w
                    )
                )
        
        self.active_workspace = False
        for w in self.workspaces:
            if w.name == self.cache.last:
                self.active_workspace = w
                
        if not self.active_workspace:
            self.active_workspace = Workspace(pathlib.join(self.root, "workspace", "model"))
            self.workspaces.add(self.active_workspace)
            self.cache >> self.active_workspace.name
        
    def __repr__(self,):
        return f"""WorkspaceManager @ {self.root}"""
        
    def __iter__(self,):
        for w in self.workspaces:
            yield w.name
        
    def new_workspace(self,name:str)->Workspace:
        workspace = Workspace(
            path = pathlib.join(self.root, "workspace", name) 
        )
        self.workspaces.add(workspace)
        self.active_workspace = workspace
        self.cache >> workspace.name
        return workspace
        
    def open_workspace(self,name:str)->Workspace:
        workspace = False
        for w in self.workspaces:
            if w.name == name:
                workspace = w
                break
                
        if workspace:
            self.active_workspace = workspace
            self.cache >> workspace.name
            return workspace
        
        return workspace
        
    def delete_workspace(self, name:str)->None:
        path = pathlib.join(self.root, "workspace", name) 
        if pathlib.isdir(path,):
            self.workspaces = [ w for w in self.workspaces if w.path != path]
            return True,rmtree(path,)
        return False
    
    def autosave(self,)->bool:
        print (self.active_workspace)
        return False
    
    def get(self,):
        return [ { "name":w.name } for w in self.workspaces ]
