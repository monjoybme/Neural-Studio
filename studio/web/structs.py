from  typing import Dict, List, Tuple, Union, Any

class DataDict(object):
    """
    DataDict object implements a easy to use dictionary interface.

    Args
    ---------------
    :param datalist: list, a list containing key, value pairs.
    :param datadict: dict, a dict containing key, value paired python dictionary.
    """
    def __init__(self, datalist: List[tuple]=[], datadict: dict={}, **datakwargs,  ) -> None:
        super().__init__()

class DataList(object):
    def __init__(self, *data, datalist: List[Any]=[]) -> None:
        super().__init__()

class DataTuple(object):
    def __init__(self,*data, datalist:List[Any]=[], placeholder: str="DataTuple") -> None:
        super().__init__()

class Integer(object):
    def __init__(self, placeholder: str='Integer') -> None:
        super().__init__()

class String(object):
    def __init__(self, placeholder: str="String" ) -> None:
        super().__init__()

class Float(object):
    def __init__(self, placeholder: str="Float") -> None:
        super().__init__()

class DataSchema(object):
    def __init__(self, ) -> None:
        super().__init__()

