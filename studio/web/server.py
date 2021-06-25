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
    """ 
    cors function provides functionality to authenticate preflight requests made by browsers.

    :param origin : str

    Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server 
    to indicate any other origins (domain, scheme, or port) than its own from which a browser should 
    permit loading of resources. CORS also relies on a mechanism by which browsers make a “preflight” 
    request to the server hosting the cross-origin resource, in order to check that the server will 
    permit the actual request. In that preflight, the browser sends headers that indicate the HTTP 
    method and headers that will be used in the actual request. 
    """
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
    """response_dict is a return typedef wrapper for server responses.

    response_dict can be used to serialize responses which are json encodable, eg. list, dict. 
    """
    return await json_response(data, code, response)

async def response_str(data: str,response: ResponseHeader=None, code: int=200)->bytes:
    """response_str is a return typedef wrapper for server responses.

    response_str can be used to serialize responses with str datatype.
    """
    return await text_response(data, code, response)

async def response_none(response)->Any:
    """response_none is a return typedef wrapper for server responses.

    response_none can be used to serialize responses which have no resonse type defined.
    """
    return response

# response typedef wrapper
response_typedef = {
    dict: response_dict,
    str: response_str,
    None: response_none
}

class Router:
    """Router object is used by server object to register end points and retrive endpoints 
    for incoming requests. Router also parses inurl variables and url queries. 

    example:
        router = Router()
        router.register("/path", view_function)

        view_function, inurl_variables, query, serialization_wrapper = router.get("/path")
    """
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

    def get_queries(self, query: list) -> dict:
        """
        get_queries function takes query string and return a dictionary of key, values pairs 
        parsed from query string.

        example:
            query_string = "firstname=john&lastname=doe"
            query_vars = get_queries(query_string) # returns { "firstname": "john", "lastname":"doe" }
        """
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
        """
        get_variables function takes url string and registered inurl variables and returns 
        a dictionary object of key, value pairs parsed from url.

        example:
            # url pattern : /api/v1/user/<str:name>
            url = "/api/v1/user/johndoe"
            inurl_vars = get_variables(url, var_patterns ) # returns { "name": "johndoe" }
        """
        return dict([
            (var, url) if vtype == 'path' else (var, dtype(path))
            for (path, _), (var, dtype, vtype)
            in zip(self.path_re.findall(url), var)
            if var
        ])

    def get(self, url):
        """
        return view_function, inurl_variables, query_variables,  serialization_wrapper for provided url.
        """
        url, *parameters = url.split("?")
        for pattern, func, var, ser_func in self:
            if pattern.match(url):
                return (
                    func,
                    self.get_variables(url, var),
                    self.get_queries(parameters,),
                    ser_func
                )
        return False, None, None, None

    def inspect_func(self, func, fvar):
        """
        check for attributes required for a view function and returns return type for view_function.
        """
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
        """
        register function can be used to register and validate view function for server object.
        """
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

    def add_lith(self, lith):
        """
        add_lith updates the current routes with Lith object.
        """
        self._routes += lith._router._routes

class Lith:
    """
    Lith object provides functionality to create view functions outside of server object. It can be used
    to modularise complex service architectures.

    Args
    ----
        :param name: str, name of the  lith architecture.
        :param use_prefix: bool, wether to use lith prefix or not.

    example:

        app = App()

        # with lith prefix
        home = Lith("home")

        @home.route("/")
        async def home_index(request: Request)->None:
            ...

        @home.route("/users")
        async def home_users(request: Request)->None:
            ...

        app.add_lith(home)

        # this will register paths as following.
        # /home/ -> home_index view function
        # /home/user -> home_user view function

        # with lith prefix
        home = Lith("home", use_prefix=False)

        @home.route("/")
        async def home_index(request: Request)->None:
            ...

        @home.route("/users")
        async def home_users(request: Request)->None:
            ...

        app.add_lith(home)

        # this will register paths as following.
        # / -> home_index view function
        # /user -> home_user view function
        
    """
    _router = Router()
    def __init__(self, name: str , use_prefix: bool=True):
        self.name = name
        self.use_prefix = use_prefix

    def __add_route__(self, func):
        """
        
        """
        if self.use_prefix:
            self.__route__ = f"/{self.name}{self.__route__}"
        self._router.register(self.__route__, func)

    def route(self, path: str, *args, **kwargs):
        self.__route__ = path
        return self.__add_route__


class Request(object):
    """Request object provides request metadata to view function.

    Args
    ---------------
    :param headers: RequestHeader, request header object.
    :param writer: asyncio.StreamWriter, stream writer object generated by server.
    :param reader: asyncio.StreamReader, stream reader object generated by server.
    :param loop: asyncio.BaseEventLoop, event loop object.

    Methods
    ---------------
    get_json -> dict: returns dictionary object generated from request data.

    Attributes
    ---------------
    content -> str: return request data.

    """
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

    async def get_json(self,)->dict:
        """
        Returns
        ---------------
            a dictionary parsed from request data.
        """
        return loads( await self.content )

    @property
    async def content(self,)->str:
        """
        Returns
        ---------------
            a string read from request data body. 
        """
        if self._content:
            return self._content
        self._content = await self.reader.readexactly(n=int(self.headers.content_length['value']))
        return self._content


class App(object):
    """
    App object implements an ASGI server that acts as central for the service architecture.
    
    Attributes
    ---------------

    Methods
    ---------------
    add_lith: update current routes with provided lith object.
    route: works as a decorator function for view functions.
    handle_request: works as handle function for incoming requests.
    serve: creates a server and runs until interruption.


    """
    def __init__(self, ):
        self.loop = asyncio.get_event_loop()
        self.router = Router()

    def __add_route__(self, func):
        self.router.register(self.__route__, func)

    def route(self, path: str, *args, **kwargs):
        self.__route__ = path
        return self.__add_route__

    def add_lith(self, lith: Lith)->None:
        """
        Updates current end point routes with provided Lith object.

        Args
        ---------------
        :param lith: Lith, Lith object.
        """
        self.router.add_lith(lith)

    async def handle_request(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter)->None:
        """
        Handles incoming requests by parsing headers, retriving view functions, generating response
        and sending responses.

        Args
        ---------------
        :param reader: asyncio.StreamReader, StreamReader object.
        :param writer: asyncio.StreamWriter, StreamWriter object.
        """
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
                response = await response_typedef.get(ser_func)(response)
            else:
                response = await json_response({"message": f"Path {header.path} not found."}, code=404)

        if response:
            writer.write(response)
            await writer.drain()
            writer.close()
        return -1

    def serve(self, host: str = 'localhost', port: int = 8080)->None:
        """
        Creates a asynchronus server and serves it until interruption.

        Args
        ---------------
        :param host: str, the hostname to listen on. eg. localhost, 0.0.0.0, domain.com
        :param port: int, the port number to listen on. eg. 8080, 8000
        """
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
