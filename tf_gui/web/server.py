import asyncio
import re
import os

from json import loads

from .headers import *
from .utils import *

__start_banner__ = """╔{top_padding}╗
║ Neural Studio Running{line_1_padding}║
║ Host : {host}{host_line_padding}║
║ Port : {port}{port_line_padding}║
║ URL  : http://{host}:{port}{url_line_padding}║
╚{top_padding}╝"""

def print_start(host: str, port: int, size: int = 32):
    # os.system("cls | clear")
    config = {
        "host":host,
        "port":port,
        "top_padding" : '═'*(size),
        "line_1_padding": ' '*(size-22),
        "host_line_padding": ' '*(size-8-len(host)),
        "port_line_padding": ' '*(size-8-len(port.__str__())),
        "url_line_padding": ' '*(size-15-1-len(host)-len(port.__str__()))
    }
    print( __start_banner__.format(**config) )


def cors(origin: str) -> bytes:
    header = ResponseHeader() | 204
    header.update(
        server(),
        access_control_allow_origin(origin),
        access_control_allow_methods(),
        access_control_allow_headers(),
        access_control_max_age(86400),
        vary(['Origin']),
        keep_alive(timeout=2, maxt=100),
        connection()
    )
    return header.encode()

def no_response() -> bytes:
    header = ResponseHeader() | 418
    header.update(
        server(),
        keep_alive(5, 1000),
        connection()
    )
    return header.encode()

class Router:
    routes = []

    def __init__(self,):
        self.url_re = re.compile(r"<\w+:\w+>")
        self.var_re = re.compile(r"\w+")
        self.path_re = re.compile(r'/([a-zA-Z0-9?=_+\-\.]+)+|(<\w+:\w+>)')

        self.dtype_re = {
            'str': '[a-zA-Z0-9_\-\.]+',
            'int': '\d+',
            'bool': '[a-zA-Z01]+'
        }

        self.dtype_obj = {
            'str': str,
            'int': int,
            'bool': eval
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
            return self.dtype_re[dtype], (var, self.dtype_obj[dtype])
        return path, (None, None)

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
        {
            name: dtype(val)
            for (name, dtype), (val, _)
            in zip(var, self.path_re.findall(url))
            if name
        }
        return dict([
            (var, dtype(path))
            for (path, _), (var, dtype)
            in zip(self.path_re.findall(url), var)
            if var
        ])

    def get(self, url):
        url, *parameters = url.split("?")
        for pattern, func, var in self:
            if pattern.match(url):
                return (
                    func,
                    self.get_variables(url, var),
                    self.get_parameters(parameters)
                )
        return False, None, None

    def register(self, url, func):
        url_pattern = ''
        url_var = []

        for path, var in self.path_re.findall(url):
            path, var = self.get_dtype(path, var)
            url_pattern += '/' + path
            url_var.append(var)

        url_pattern = url_pattern if len(url_pattern) else url
        url_pattern += '$'
        self += [re.compile(url_pattern), func, url_var]


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
        loop,
    ):
        self.headers = headers
        self.reader = reader
        self.writer = writer
        self.loop = loop

    async def get_json(self,):
        if self._content:
            return loads(self._content)
        self._content = await self.reader.readexactly(n=int(self.headers.content_length['value']))
        return loads(self._content)

    @property
    async def content(self,):
        if self._content:
            return self._content
        self._content = await self.reader.readexactly(n=int(self.headers.content_length['value']))
        return self._content


class App(object):
    def __init__(self,):
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

        headers = RequestHeader().parse(header_string.decode())
        if headers.method == 'OPTIONS':
            response = cors(headers.origin['value'])
        else:
            handle, var, query = self.router.get(headers.path)
            if handle:
                response = await handle(Request(headers, reader, writer, self.loop), **var)
            else:
                response = await json_response({"message": f"Path {headers.path} not found."})
        
        if response:
            writer.write(response)
        else:
            writer.write(no_response())
        
        await writer.drain()
        writer.close()
        return -1

    def serve(self, host: str = 'localhost', port: int = 8080):
        self.loop.create_task(
            asyncio.start_server(
                self.handle_request,
                host,
                port,
            )
        )
        try:
            print_start(host, port)
            self.loop.run_forever()
        except KeyboardInterrupt:
            exit(print("Exiting Serve !"))


request = Request
