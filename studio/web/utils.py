import asyncio
import aiofiles as io
import time

from json import dumps
from os import path as pathlib, stat

from .headers import *

class Request(object):
    headers: RequestHeader = None
    writer: asyncio.StreamWriter = None
    reader: asyncio.StreamReader = None
    loop = asyncio.BaseEventLoop

async def text_response(
        text:str,
        code:int=200,
        response:ResponseHeader=None
    )->bytes:
    """Returns a response object with a text/plain response."""
    if response is None:
        response = ResponseHeader() | code
    
    response.update(
        content_length(len(text)),
        content_type(mime_types['.text'])
    )
    return response @ text

async def json_response(
        data:dict,
        code:int=200,
        response: ResponseHeader = None,
    )->bytes:

    if response is None:
        response = ResponseHeader() | code
        
    data = dumps(data)
    response.update(
        access_control_allow_origin(),
        content_type(mime_types.get('.json')),
        content_length(len(data)),
    )
    return response @ data


async def send_file(file:str,request:Request, response:ResponseHeader = None ,headers:List[dict]=[], dispose: bool = True)->bool:  
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
    if response is None:
        response = ResponseHeader() | code
    response += location(url,)
    return response @ f"Redirecting to : {url}"
