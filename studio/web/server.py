import asyncio
import re
import os
import sys
import numpy as np

from json import loads
from inspect import getfullargspec, iscoroutinefunction
from typing import Any, Tuple, Union, Callable

from .headers import *
from .utils import *
from .types import FuncTypeDef, type_abc

ROOT_FOLDER = os.path.abspath("./")
STATIC_FOLDER = os.path.abspath("./static")


def print_start(host: str, port: int, size: int = 32) -> None:
    os.system("cls|clear")
    print(
        f"""╔{'═'*(size)}╗
║ PyRex Running{' '*(size-14)}║
║ Host : {host}{' '*(size-8-len(host))}║
║ Port : {port}{' '*(size-8-len(str(port)))}║
║ URL  : http://{host}:{port}{' '*(size-16-len(host)-len(str(port)))}║
╚{'═'*(size)}╝""")

def cors(origin: str) -> bytes:
    """ 
    cors function provides functionality to authenticate preflight requests made 
    by browsers.

    :param origin : str

    Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that 
    allows a server to indicate any other origins (domain, scheme, or port) than 
    its own from which a browser should permit loading of resources. CORS also 
    relies on a mechanism by which browsers make a “preflight” request to the 
    server hosting the cross-origin resource, in order to check that the server 
    will permit the actual request. In that preflight, the browser sends headers 
    that indicate the HTTP method and headers that will be used in the actual 
    request. 
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


async def not_found_error(request,  **kwargs) -> bytes:
    return await json_response({"message": f"path {request.headers.path} not found!"})


async def not_allowed_error(request,  **kwargs) -> bytes:
    return await method_not_allowed(message=f"method {request.headers.method} not allowed for {request.headers.path}")


def test_random_routes(
    n: int = 1000,
    min_length: int = 1,
    max_length: int = 16
) -> list:
    route_verbs = [
        '/home',
        '/user',
        '/about',
        '/admin',
        '/data',
        '/store',
        '/hello',
        '/world',
        '/foo',
        '/bar',
        '/api',
        '/v1',
        '/v2',
    ]

    methods = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ]

    routes = []
    verb_size = np.arange(min_length, max_length)
    while len(routes) < n:
        path = "".join(np.random.choice(
            route_verbs, size=np.random.choice(verb_size)))
        for method in np.random.choice(
                methods, size=np.random.choice([0, 1, 2]), replace=False):
            routes.append((method, path))

    return routes


class Route:
    def __init__(self,
                 view_func: callable,
                 url_var: dict,
                 func_def: FuncTypeDef
                 ) -> None:
        """Route implements interface for storing route information.

        Args
        ---------------
        :param view_func: callable, view function for the route
        :param url_var: dict, a dictionary containing meta data for inurl 
                        variables
        :param func_def: FuncTypeDef, a interface containing view function 
                         metadata.
        :param methods: list, 
                        list of methods allowed for view function.
        """
        self.view_func = view_func
        self.url_var = url_var
        self.func_def = func_def


class RouteCollection:
    path: re.Pattern
    methods: dict

    def __init__(self, path: re.Pattern):
        self.path = path
        self.methods = {
            "GET": False,
            "POST": False,
            "PUT": False,
            "DELETE": False,
            "PATCH": False
        }

    def __getitem__(self, method: str) -> Route:
        return self.methods[method]

    def __setitem__(self, method: str, view: callable):
        self.methods[method] = view

    def __iter__(self, ) -> Tuple[str, Union[Route, bool]]:
        for method, route in self.methods.items():
            yield method, route


class Router:
    """Router object is used by server object to register end points and retrive 
    endpoints for incoming requests. Router also parses inurl variables and url 
    queries. 

    example:
        router = Router()
        router.register("/path", view_function)

        view_function, inurl_variables, query, serialization_wrapper = router.get("/path")

    """
    _routes = {}

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

    def __setitem__(self, path: str, collection: RouteCollection):
        self._routes[path] = collection

    def __getitem__(self, path: str) -> RouteCollection:
        return self._routes[path]

    def __iter__(self,) -> Tuple[str, RouteCollection]:
        for path, collection in self._routes.items():
            yield path, collection

    def __repr__(self, ) -> str:
        repr_out = ""
        for i, (path, collection) in enumerate(self):
            repr_out += f"{i+1}. {path}\n"
            for method, route in collection:
                if route:
                    var_dict = dict([(var, typed)
                                     for var, _, typed in route.url_var if var])
                    repr_out += (
                        f"{'    '}{method}{' '*(7-len(method))}" +
                        f"{var_dict} -> " +
                        f"{route.view_func.__name__} -> " +
                        f"{route.func_def.__class__.__name__}\n"
                    )
            repr_out += '\n'
        return repr_out

    def __add__(self, val):
        self._routes.append(val)
        return self

    def get_dtype(self, path, var):
        if self.url_re.match(var):
            dtype, var = self.var_re.findall(var)
            return self.dtype_re[dtype], (var, self.dtype_obj[dtype], dtype)
        return path, (None, None, None)

    def get_queries(self, query: list) -> dict:
        """
        get_queries function takes query string and return a dictionary of key, 
        values pairs parsed from query string.

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
        get_variables function takes url string and registered inurl variables 
        and returns a dictionary object of key, value pairs parsed from url.

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

    def inspect_func(self,  view, fvar) -> FuncTypeDef:
        """
        check for attributes required for a view function and returns return 
        type for view_function.
        """
        specs = getfullargspec(view)
        args = specs.args
        defs = specs.defaults
        ants = specs.annotations

        assert iscoroutinefunction(view), ("route handle should be a coroutine object")
        assert len(args), f"Please provide request as a argument in the route definition `{ view.__name__}`"
        assert "request" in args, f"Please provide `request` as a argument in the route definition  `{ view.__name__}`"
        for var, _, _ in fvar:
            if var is not None:
                assert var in args, f"Please provide `{var}` as a argument in the route definition `{ view.__name__}`"
        assert "return" in ants, f"Please provide default return type in route `{ view.__name__}`"

        return ants['return']

    def register(self, url: str,  view: callable, methods: list = ['GET']) -> None:
        """
        register function can be used to register and validate view function for server object.
        """
        assert url.startswith("/"), "Route should start with `/`"
        url_pattern = ''
        url_var = []

        for path, var in self.path_re.findall(url):
            path, var = self.get_dtype(path, var)
            url_pattern += '/' + path
            url_var.append(var)

        url_pattern = url_pattern if len(url_pattern) else url
        url_pattern += '$'

        func_def = self.inspect_func(view, url_var)

        if url in self._routes:
            for method in methods:
                assert not self[url][method], f"path {url} already registered with method {method}"
                self[url][method] = Route(view, url_var, func_def)
        else:
            self[url] = RouteCollection(re.compile(url_pattern))
            for method in methods:
                self[url][method] = Route(view, url_var, func_def)

    def get(self, url: str, view: callable) -> None:
        self.register(url, view, methods=['GET'])

    def post(self, url: str, view: callable) -> None:
        self.register(url, view, methods=['POST'])

    def put(self, url: str, view: callable) -> None:
        self.register(url, view, methods=['PUT'])

    def delete(self, url: str, view: callable) -> None:
        self.register(url, view, methods=['DELETE'])

    def patch(self, url: str, view: callable) -> None:
        self.register(url, view, methods=['PATCH'])

    def parse(self, method: str, url: str) -> Tuple[callable, dict, dict, FuncTypeDef]:
        """
        return view_function, inurl_variables, query_variables,  serialization_wrapper for provided url.
        """
        url, *parameters = url.split("?")
        for path, collection in self:
            if collection.path.match(url):
                if collection[method]:
                    route = collection[method]
                    return (
                        route.view_func,
                        self.get_variables(url, route.url_var),
                        self.get_queries(parameters),
                        route.func_def
                    )
                else:
                    return not_allowed_error, {}, {}, type_abc()
        return not_found_error, {}, {}, type_abc()

    def add_lith(self, lith):
        """
        add_lith updates the current routes with Lith object.
        """
        self._routes.update(lith._routes)


class Lith(Router):
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

    def __init__(self, name: str, use_prefix: bool = True):
        super().__init__()
        self.name = name
        self.use_prefix = use_prefix

    def __route__wrapper(self,  view):
        """
        decorator wrapper for route registration
        """
        if self.use_prefix:
            self._view_meta['url'] = f"/{self.name}{self._view_meta['url']}"
        self._view_meta['view'] = view
        self.register(**self._view_meta)

    def route(self, url: str, methods: list = ['GET']):
        self._view_meta = {
            "url": url,
            "methods": methods
        }
        return self.__route__wrapper

    def get(self, url: str,):
        return self.route(url, methods=['GET'])

    def post(self, url: str,):
        return self.route(url, methods=['POST'])

    def put(self, url: str,):
        return self.route(url, methods=['PUT'])

    def patch(self, url: str,):
        return self.route(url, methods=['PATCH'])

    def delete(self, url: str,):
        return self.route(url, methods=['DELETE'])


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
    _json = None

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

    async def get_json(self,) -> dict:
        """
        Returns
        ---------------
            a dictionary parsed from request data.
        """
        if not self._json:
            self._json = loads(await self.content)

        return self._json

    @property
    async def content(self,) -> str:
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

    def __route__wrapper(self,  view):
        """
        decorator wrapper for route registration
        """
        self._view_meta['view'] = view
        self.router.register(**self._view_meta)

    def route(self, url: str, methods: list = ['GET']):
        self._view_meta = {
            "url": url,
            "methods": methods
        }
        return self.__route__wrapper

    def get(self, url: str,):
        return self.route(url, methods=['GET'])

    def post(self, url: str,):
        return self.route(url, methods=['POST'])

    def put(self, url: str,):
        return self.route(url, methods=['PUT'])

    def patch(self, url: str,):
        return self.route(url, methods=['PATCH'])

    def delete(self, url: str,):
        return self.route(url, methods=['DELETE'])

    def add_lith(self, lith: Lith) -> None:
        """
        Updates current end point routes with provided Lith object.

        Args
        ---------------
        :param lith: Lith, Lith object.
        """
        self.router.add_lith(lith)

    async def handle_request(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
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
            handle, var, query, func_type_def = self.router.parse(header.method,header.path)
            response = await func_type_def.wrapper(
                await handle(request=Request(header, reader, writer, self.loop), **var)
            )

        if response:
            writer.write(response)
            await writer.drain()
            writer.close()
        return -1

    def serve(self, host: str = 'localhost', port: int = 8080) -> None:
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
