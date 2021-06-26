from .structs import *
from .utils import *
from .headers import *

async def type_dict_wrapper(_, data: dict, response: ResponseHeader = None, code: int = 200) -> bytes:
    """type_dict_wrapper is a return typedef wrapper for server responses.

    type_dict_wrapper can be used to serialize responses which are json encodable, eg. list, dict. 
    """
    return await json_response(data, code=code, response=response)

async def type_str_wrapper(_, data: str, response: ResponseHeader = None, code: int = 200) -> bytes:
    """type_str_wrapper is a return typedef wrapper for server responses.

    type_str_wrapper can be used to serialize responses with str datatype.
    """
    return await text_response(data, code=code, response=response)

async def type_abc_wrapper(_, data: str) -> Any:
    """type_str_wrapper is a return typedef wrapper for server responses.

    type_str_wrapper can be used to serialize responses with str datatype.
    """
    return data

class FuncTypeDef:
    wrapper: callable

class type_dict:
    wrapper =  type_dict_wrapper

class type_list:
    wrapper = type_dict_wrapper

class type_abc:
    wrapper = type_abc_wrapper

class types:
    dict = type_dict()
    list = type_list()
    file = type_abc()
    sock = type_abc()

types = types()

def test():
    pass


if __name__ == "__main__":
    test()
