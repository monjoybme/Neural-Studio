import asyncio
import re
import os
import sys

from json import loads
from inspect import getfullargspec, iscoroutinefunction
from typing import Any

from .headers import *
from .utils import *

ROOT_FOLDER = os.path.abspath("./")
STATIC_FOLDER = os.path.abspath("./static")


def print_start(host: str, port: int, size: int = 32)->None:
    print(f"""╔{'═'*(size)}╗
║ PyRex Running{' '*(size-14)}║
║ Host : {host}{' '*(size-8-len(host))}║
║ Port : {port}{' '*(size-8-len(str(port)))}║
║ URL  : http://{host}:{port}{' '*(size-16-len(host)-len(str(port)))}║
╚{'═'*(size)}╝""")


def cors(origin: str) -> bytes:
    header = ResponseHeader() | 204
    header.update(
        server(),
        access_control_allow_origin(origin),
        access_control_allow_methods(),
        access_control_allow_headers(),
        access_control_max_age(86400),
        vary(),
        keep_alive(timeout=2, maxt=100),
        connection()
    )
    return header.encode()

async def response_dict(data: dict,response: ResponseHeader=None, code: int=200)->bytes:
    return await json_response(data, code, response)

async def response_str(data: str,response: ResponseHeader=None, code: int=200)->bytes:
    return await text_response(data, code, response)

async def response_none(response)->Any:
    return response

response_refs = {
    dict: response_dict,
    str: response_str,
    None: response_none
}

class Router:
    routes = []
    _routes = []

    def __init__(self,):
        self.url_re = re.compile(r"<\w+:\w+>")
        self.var_re = re.compile(r"\w+")
        self.path_re = re.compile(r'/([a-zA-Z0-9?=_+\-\.]+)+|(<\w+:\w+>)')

        self.dtype_re = {
            'str': '[a-zA-Z0-9_\-\.]+',
            'int': '\d+',
            'bool': '[a-zA-Z01]+',
            'path': '[a-zA-Z\/]+'
        }

        self.dtype_obj = {
            'str': str,
            'int': int,
            'bool': eval,
            'path': str
        }

    def __setitem__(self, key, value):
        self.routes[key] = value

    def __getitem__(self, key):
        return self.routes[key]

    def __iter__(self,):
        for key in self.routes:
            yield key

    def __add__(self, val):
        self.routes.append(val)
        return self

    def get_dtype(self, path, var):
        if self.url_re.match(var):
            dtype, var = self.var_re.findall(var)
            return self.dtype_re[dtype], (var, self.dtype_obj[dtype], dtype)
        return path, (None, None, None)

    def get_parameters(self, query: list) -> dict:
        if not query:
            return dict()
        query, = query
        return dict([
            q.split("=")
            for q
            in query.split("&")
            if q
        ])

    def get_variables(self, url: str, var: str) -> dict:
        return dict([
            (var, url) if vtype == 'path' else (var, dtype(path))
            for (path, _), (var, dtype, vtype)
            in zip(self.path_re.findall(url), var)
            if var
        ])

    def get(self, url):
        url, *parameters = url.split("?")
        for pattern, func, var, ser_func in self:
            if pattern.match(url):
                return (
                    func,
                    self.get_variables(url, var),
                    self.get_parameters(parameters),
                    ser_func
                )
        return False, None, None, None

    def inspect_func(self, func, fvar):
        specs = getfullargspec(func)
        args = specs.args
        defs = specs.defaults
        ants = specs.annotations

        assert iscoroutinefunction(
            func), "route handle should be a coroutine object"
        assert len(
            args), f"Please provide request as a argument in the route definition `{func.__name__}`"
        assert "request" in args, f"Please provide `request` as a argument in the route definition  `{func.__name__}`"
        for var, _, _ in fvar:
            if var is not None:
                assert var in args, f"Please provide `{var}` as a argument in the route definition `{func.__name__}`"
        assert "return" in ants, f"Please provide default return type in route `{func.__name__}`"

        return ants['return']

    def register(self, url: str, func: callable) -> None:
        assert url.startswith("/"), "Route should start with `/`"
        assert url not in self._routes, f"Route {url} registered."
        url_pattern = ''
        url_var = []

        for path, var in self.path_re.findall(url):
            path, var = self.get_dtype(path, var)
            url_pattern += '/' + path
            url_var.append(var)

        url_pattern = url_pattern if len(url_pattern) else url
        url_pattern += '$'

        ser_func = self.inspect_func(func, url_var)
        self += [re.compile(url_pattern), func, url_var, ser_func]
        self._routes.append(url)

class Request(object):
    headers: RequestHeader = None
    writer: asyncio.StreamWriter = None
    reader: asyncio.StreamReader = None
    loop = None

    _content = None

    def __init__(
        self,
        headers: RequestHeader,
        reader: asyncio.StreamReader,
        writer: asyncio.StreamWriter,
        loop: asyncio.BaseEventLoop,
    ):
        self.headers = headers
        self.reader = reader
        self.writer = writer
        self.loop = loop

    async def get_json(self,):
        return loads( await self.content )

    @property
    async def content(self,):
        if self._content:
            return self._content
        self._content = await self.reader.readexactly(n=int(self.headers.content_length['value']))
        return self._content


class App(object):
    def __init__(self, ):
        self.loop = asyncio.get_event_loop()
        self.router = Router()

    def __add_route__(self, func):
        self.router.register(self.__route__, func)

    def route(self, path: str, *args, **kwargs):
        self.__route__ = path
        return self.__add_route__

    async def handle_request(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        response = False
        try:
            header_string = await reader.readuntil(separator=b'\r\n\r\n')
        except asyncio.exceptions.IncompleteReadError:
            return -1
        except OSError:
            return -1
        finally:
            pass

        header = RequestHeader().parse(header_string.decode())
        if header.method == 'OPTIONS':
            response = cors(header.origin['value'])
        else:
            handle, var, query, ser_func = self.router.get(header.path)
            if handle:
                response = await handle(Request(header, reader, writer, self.loop), **var)
                response = await response_refs.get(ser_func)(response)
            else:
                response = await json_response({"message": f"Path {header.path} not found."}, code=404)

        if response:
            writer.write(response)
            await writer.drain()
            writer.close()
        return -1

    def serve(self, host: str = 'localhost', port: int = 8080, ssl_ctx=None):
        self.loop.create_task(asyncio.start_server( self.handle_request, host, port, ssl= ssl_ctx ))
        
        try:
            print_start(host, port)
            self.loop.run_forever()
        except KeyboardInterrupt:
            exit(print("Exiting Serve !"))
