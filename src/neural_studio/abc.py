import re
import numpy as np

from tensorflow import keras
from time import sleep
from threading import Thread
from typing import Any, Iterator, List, Set, Tuple, Dict, List, Tuple, Union
from pyrex.core.abs import AbsForm

class AbsDataDict:
    """
    Abstract DataDict

        This class is used to store data in a dictionary like object. 
    """
    def __init__(self, data_dict: dict = {}, iterable: iter = [], level: int = 1, **kwargs): ...
        
    def __iter__(self, ): ...

    def __repr__(self, ): ...

    def __getitem__(self, key: str): ...

    def __setitem__(self, key: str, value: Any): ...

    @property
    def idx(self, ) -> str: ...

    def to_dict(self, ): ...

class AbsDataset:
    """
    Abstract Dataset
    """
    labels: List[str]
    train_x: np.ndarray
    train_y: np.ndarray
    test_x: np.ndarray
    test_y: np.ndarray
    size: Tuple[int, int, int]
    def sample(self, n: int = 5) -> List[dict]: ...

    def pre_process(self, data: dict, *args, **kwargs) -> None: ...

    def post_inference(self, prediction: Any, *args, **kwargs) -> dict: ...

    def pre_process_public(self, form: AbsForm, *args, **kwargs) -> dict: ...

class AbsDatasetDef(AbsDataDict):
    _dataset: AbsDataset 
    def __init__(self, datasetdef: dict): ...

    def __repr__(self,) -> str: ...

    def _abs(self, value: dict) -> Any: ...

    def build(self, ) -> Tuple[bool, str]: ...

    def to_code(self, ) -> str: ...

    @property
    def dataset(self, ) -> AbsDataset: ...


class AbsGraphDef(AbsDataDict):
    __optimizer__ = False

    def __init__(self, graphdef: dict): ...

    def __repr__(self,) -> str: ...

    def build(self, ) -> Tuple[bool, str]: ...

    @property
    def dataset(self, ) -> AbsDataset: ...

    def to_code(self, ) -> str: ...

class AbsCache(object):
    recent: List[str] 

    def __init__(self, root: str): ...

    def __getitem__(self, key): ...

    def __rshift__(self, other: str): ...

    def __lshift__(self, other: str): ...

    def __write__(self,): ...

    @property
    def last(self,) -> str: ...


class AbsWorkspace:
    __required__vars__: List
    __vars__ = List[str]

    app: AbsDataDict
    home: AbsDataDict
    dataset: AbsDataDict
    canvas: AbsDataDict
    train: AbsDataDict

    def __init__(self, path: str, metadata: dict = {}): ...

    def __repr__(self,) -> str: ...

    def __setitem__(self, key: str, val: dict): ...

    @property
    def path(self, ) -> str: ...

    def save(self,) -> int: ...

    def set(self, **kwargs): ...

    def get_vars(self, ) -> Iterator: ...

    def get_var_dict(self, ) -> dict: ...


class AbsWorkspaceManager(AbsDataDict):

    workspaces: Set[str] 
    dataset: AbsDatasetDef 
    active: AbsWorkspace 

    def __init__(self, root='.tfstudio'): ...

    def __repr__(self,) -> str: ...

    def __iter__(self,) -> Iterator[AbsWorkspace]: ...

    def new_workspace(self, data: dict) -> AbsWorkspace: ...

    def open_workspace(self, name: str) -> AbsWorkspace: ...

    def delete_workspace(self, name: str) -> None: ...

    def delete_multiple(self, w_list: list = [], d_all=False): ...

    def get_workspaces(self,) -> Set[str]: ...


class AbsOutputVisualizer(keras.callbacks.Callback):
    visualizer: callable
    
    def __init__( self, problem_type: str = None, *args, **kwargs ) -> None:  ...
    
    def on_epoch_end(self, epoch: int, logs: list) -> None: ...

class AbsTfGui(keras.callbacks.Callback):
    batch: int
    epoch: int
    batch_size: int
    batches: int
    epochs: int

    trainer: None
    halt: bool
    output: List[Dict]

    def __init__(self, trainer,): ...

    def __repr__(self,) -> str : ...

    @property
    def status(self,) -> dict : ...

    def stop(self,) -> None: ...

    def on_batch_end(self, batch: dict, logs=None) -> None: ...

    def on_epoch_begin(self, epoch, logs=None): ...

    def on_epoch_end(self, epoch, logs=None): ...

    def on_train_end(self, logs): ...

class AbsTrainer(object):
    training: bool
    build: bool
    re_charset: str
    build_config: dict
    is_training: bool
    logs: list
    workspace_manager: AbsWorkspaceManager
    session_id: int
    tfgui: AbsTfGui

    _session_var: dict
    _model: keras.Model 
    _model_name: str 
    _dataset: AbsDataset

    def __init__(self, workspace_manager: AbsWorkspaceManager): ...

    @property
    def dataset(self, ) -> Union[AbsDataset, bool]: ...

    @property
    def model(self,) -> keras.Model: ...

    @property
    def summary(self, ) -> List[List[str]]: ...

    @property
    def session(self,) -> dict: ...

    def update_log(self, log_type: str, log: dict): ...

    def update_session(self, data: dict) -> None: ...

    def infer(self, dx: np.ndarray) -> np.ndarray: ...

    def build(self,) -> Tuple[bool, str] : ...

    def compile(self,) -> Tuple[bool, str] : ...

    def _train_thread(self, ) -> None: ...

    def halt(self, state) -> None: ...

    def start(self,) -> None: ...

    def stop(self,): ...
