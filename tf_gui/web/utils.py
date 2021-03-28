from .__imports__ import (
            dumps,loads,pathlib,stat,asyncio
        )

from .headers import Header,ResponseHeader
from .mime_types import raw_text

import aiofiles as io
import time

def text_response(
        text:str,
        status_code:int=200,
        message:str='OK'
    )->str:
    response = ResponseHeader()
    response.status_code = status_code
    response.message =  message
    response.content_length = len(text)
    response.content_type = 'text/plain; charset=utf-8'
    return response / text

def json_response(
        data:dict,
        status_code:int=200,
        message:str='OK'
    )->str:
    data = dumps(data)
    response = ResponseHeader()
    response.status_code = status_code
    response.message = [message]
    response.content_length = len(data)
    response.content_type = 'application/json; charset=utf-8'
    return response / data


async def send_file(file:str,request,headers:dict=dict(),chunk_size=1024):  
    head = ResponseHeader()
    head.status_code = 200
    head.message = 'OK'
    head.access_control_allow_origin = "*"
    head.connection = "Keep-Alive"
    head.content_type = 'application/octet-stream'
    head.keep_alive = "timeout=1, max=999"
    head.content_length = stat(file).st_size
    
    for key,val in headers.items():
        head[key.title().replace("_","-")] = val

    request.writer.write(head.encode())
    async with io.open(file, mode='rb') as fstream:
        while True:
            send_bit = await fstream.read(chunk_size)
            if send_bit and not request.writer.is_closing():
                request.writer.write(send_bit)
            else:
                break

    request.writer.close()
    return False

mime_type = dict((
    row.split("\t")
        for
    row
        in 
    raw_text.split("\n")
))