import asyncio
import aiofiles as io
import time

from json import dumps
from os import path as pathlib, stat

from .headers import *

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
        content_type(mime_types['.text']),
        access_control_allow_origin()
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
        content_type(mime_types.get('.json')),
        content_length(len(data)),
        access_control_allow_origin()
    )
    return response @ data


async def send_file(file:str,request:RequestHeader, response:ResponseHeader = None ,headers:List[dict]=[],chunk_size=1024)->bool:  
    *_,name = pathlib.split(file)
    *_, ext = name.split(".")
    if response is None:
        header = ResponseHeader() | 200

    header.update(
        access_control_allow_origin(),
        connection(),
        keep_alive(1, 999),
        content_length(stat(file).st_size),
        content_disposition(name)
    )
    header.update(*headers)
    try:
        header += content_type(mime_types.get(ext))
    except KeyError as e:
        header += content_type('application/octet-stream')
    request.writer.write(header.encode())
    async with io.open(file, mode='rb') as fstream:
        while True:
            send_bit = await fstream.read(chunk_size)
            if send_bit and not request.writer.is_closing():
                request.writer.write(send_bit)
            else:
                break
    request.writer.close()
    return False

async def redirect(url:str, code:int= 302, response:ResponseHeader = None)->bytes:
    if response is None:
        response = ResponseHeader() | code
    response += location(url,)
    return response @ f"Redirecting to : {url}"
