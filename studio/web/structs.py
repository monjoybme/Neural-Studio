from  typing import Dict, List, Tuple, Union, Any

class DataDict(object):
    def __init__(self, datalist: List[tuple]=[], datadict: dict={}, placeholder: str="DataDict" ,**datakwargs,  ) -> None:
        """
        DataDict object implements a easy to use dictionary interface.

        Args
        ---------------
        :param datalist: list, a list containing key, value pairs.
        :param datadict: dict, a dict containing key, value paired python dictionary.
        """
        super().__init__()
        for key, val in datalist:
            if isinstance(val, dict):
                val = DataDict(datadict=val)
            self[key] = val

        for key, val in datadict.items():
            if isinstance(val, dict):
                val = DataDict(datadict=val)
            self[key] = val

        for key, val in datakwargs.items():
            if isinstance(val, dict):
                val = DataDict(datadict=val)
            self[key] = val

    def __setitem__(self, key: str, value: Any):
        self.__dict__[key] = value

    def __getitem__(self, key: str):
        return self.__dict__[key]

class DataList(object):
    def __init__(self, *data, datalist: List[Any]=[], placeholder: str="DataList") -> None:
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

class BaseModel(object):
    """
    BaseModel implements an abstract wrapper for data classes and automates the process of response
    generation and documenting api endpoints.
    """
    def __init__(self, datadict,**kwargs) -> None:
        self.__dict__.update(self.__annotations__)
        super().__init__()

    def __iter__(self, )->tuple:
        for key, value in self.__dict__.items():
            yield key, value

    def __repr__(self) -> str:
        return repr(self.__annotations__)

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        return super().__call__(*args, **kwds)


def test():
    class Response(BaseModel):
        name: str
        id: int

if __name__ == "__main__":
    test()

