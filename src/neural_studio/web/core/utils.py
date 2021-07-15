import asyncio

from json import dumps
from os import path as pathlib, stat

from .headers import *
"""
TODO 
    1. Add docstrings
    2. Add status code functions eg. method not allowed, unauthorized ...
"""

class Request(object):
    headers: RequestHeader = None
    writer: asyncio.StreamWriter = None
    reader: asyncio.StreamReader = None
    loop = asyncio.BaseEventLoop

async def text_response(
        text:str,
        code:int=200,
        response:ResponseHeader=None,
        *args, **kwargs
    )->bytes:
    """
    generates response object for provided text data.

    Args
    ---------------
    :param text: str, text data to add in response.
    :param code: int, response code.
    :param response: ResponseHeader, pre defined response header id any.

    Returns
    --------------- 
    A response object with a text/plain response.
    """
    if response is None:
        response = ResponseHeader() | code
    
    response.update(
        access_control_allow_origin(),
        content_length(len(text)),
        content_type('.text')
    )
    return response @ text

async def json_response(
        data:dict,
        code: int = 200,
        response:ResponseHeader=None,
        *args, **kwargs
    )->bytes:
    """
    returns a response object with application/json content type and provided data.

    Args
    ---------------
    :param data: dict, data dict to add in response.
    :param code: int, response code.
    :param response: ResponseHeader, pre defined response header id any.

    Returns
    --------------- 
    A response object with a application/json response.
    """
    if response is None:
        response = ResponseHeader() | code    

    data = dumps(data)
    response.update(
        access_control_allow_origin(),
        content_type(mime_types.get('.json')),
        content_length(len(data)),
    )
    return response @ data

async def send_file(
        file:str,request:Request, 
        response:ResponseHeader = None ,
        headers:List[dict]=[], 
        dispose: bool = True,
        *args, **kwargs
    )->bool:
    """
    sends file from provided path as a response.

    Args
    ---------------
    :param file: str, file path.
    :param response: ResponseHeader, pre defined response header id any.
    :param headers: list, a list of header objects to include in response.
    :param dispose: bool, to send file as a attachment or not, setting this true
                    will automatically mark every file for download.

    Returns
    --------------- 
    False
    """
    *_,name = pathlib.split(file)
    *_, ext = name.split(".")
    transport = request.writer.transport
    if response is None:
        header = ResponseHeader() | 200

    header.update(
        access_control_allow_origin(),
        connection(),
        keep_alive(1, 999),
        content_length(stat(file).st_size),
        content_type(ext)
    )

    if dispose: header += content_disposition(name)
    header.update(*headers)
    transport.write(header.encode())
    with open(file, "rb") as fp:
        await request.loop.sendfile(transport, fp)

    transport.close()
    request.writer.close()
    return False

async def redirect(url:str, code:int= 302, response:ResponseHeader = None)->bytes:
    """
    redirects the broweser to provided url.

    Args
    ---------------
    :param url: str, file path.
    :param code: int, status code, by default it will be 302, but you can also 
                 use 301. 
    :param response: ResponseHeader, pre defined response header id any.
    Returns
    --------------- 
    False
    """
    if response is None:
        response = ResponseHeader() | code
    response += location(url,)
    return response @ f"Redirecting to : {url}"


async def method_not_allowed(message: str = "method now allowed", code: int = 405, response: ResponseHeader = None) -> bytes:
    if response is None:
        response = ResponseHeader() | code
    return await json_response({"message": message}, code, response)


async def not_found_error(request,  **kwargs) -> bytes:
    return await json_response({"message": f"path {request.headers.path} not found!"}, code=404)
    

async def method_not_allowed(message: str = "method now allowed", code: int = 405, response: ResponseHeader = None) -> bytes:
    if response is None:
        response = ResponseHeader() | code
    return await json_response({"message": message}, code, response)


async def not_found_error(request,  **kwargs) -> bytes:
    return await json_response({"message": f"path {request.headers.path} not found!"}, code=404)


async def template_not_found_error(name: str,  **kwargs) -> bytes:
    return await json_response({"message": f"template {name} not found!"}, code=404)


async def render_view(
    html: str,
    code: int = 200,
    response: ResponseHeader = None,
    *args, **kwargs
) -> bytes:
    """
    generates response object for provided text data.
    Args
    ---------------
    :param text: str, text data to add in response.
    :param code: int, response code.
    :param response: ResponseHeader, pre defined response header id any.
    Returns
    --------------- 
    A response object with a text/html response.
    """
    if response is None:
        response = ResponseHeader() | code

    response.update(
        access_control_allow_origin(),
        content_length(len(html)),
        content_type('.html')
    )
    return response @ html
