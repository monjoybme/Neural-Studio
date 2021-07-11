from typing import Any

TABSPACE = ' '*4
NEWLINE = '\n'


class DataDict:
    def __init__(self, data_dict: dict = {}, iterable: iter = [], level: int = 1, **kwargs):
        self.__level__ = level
        for key, value in data_dict.items() if isinstance(data_dict, dict) else data_dict:
            if type(value) == dict:
                value = DataDict(data_dict=value, level=level + 1)
            self.__dict__[key] = value
        for key, value in iterable:
            if type(value) == dict:
                value = DataDict(data_dict=value, level=level + 1)
            self.__dict__[key] = value
        for key, value in kwargs.items():
            if type(value) == dict:
                value = DataDict(data_dict=value, level=level + 1)
            self.__dict__[key] = value

    def __iter__(self, ):
        for key, value in self.__dict__.copy().items():
            if not key.startswith("__"):
                yield key, value

    def __repr__(self, ):
        repr_val = '{\n'
        indent = self.__level__ * TABSPACE
        for key, val in self:
            repr_val += f"{indent}{key} : {val},\n"
        repr_val += (self.__level__ - 1) * TABSPACE + '}'
        return repr_val

    def __getitem__(self, key: str):
        if type(key) == list:
            key, = key
            keys = key.split(":")
            k, *keys = keys
            return_value = self[k]
            for k in keys:
                return_value = return_value[k]
            return return_value
        return self.__dict__[key]

    def __setitem__(self, key: str, value: Any):
        if type(key) == list:
            keys, = key
            key, *keys, dk = keys.split(":")
            elem = self[key]
            for k in keys:
                elem = elem[k]
            elem[dk] = value
        else:
            self.__dict__[key] = value

    @property
    def idx(self, ):
        return self.__name__

    def to_dict(self, ):
        out = dict()
        for key, val in self:
            if isinstance(val, DataDict):
                val = val.to_dict()
            out[key] = val
        return out
