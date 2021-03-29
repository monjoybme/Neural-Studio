
# from .utils import Response
from .headers import Header,RequestHeader
from .utils import text_response,json_response
from .__imports__ import (
    asyncio,re,loads
)

class Route(object):
    def __init__(self,callback,):
        pass

class Router:
    routes = []
    def __init__(self,):
        self.url_re = re.compile(r"<\w+:\w+>")
        self.var_re = re.compile(r"\w+")
        self.path_re = re.compile(r'/([a-z0-9?=-_+]+)+|(<\w+:\w+>)')
        
        self.dtype_re = {
            'string':'[a-zA-Z0-9_-]+',
            'int':'\d+'
        }
        self.dtype_obj = {
            'string':str,
            'int':int
        }
            
    def __setitem__(self,key,value):
        self.routes[key] = value
            
    def __getitem__(self,key):
        return self.routes[key]
        
    def __iter__(self,):
        for key in self.routes:
            yield key
        
    def __add__(self,val):
        self.routes.append(val)
        return self
        
    def get_dtype(self,path,var):
        if self.url_re.match(var):
            dtype,var = self.var_re.findall(var)
            return self.dtype_re[dtype],(var,self.dtype_obj[dtype])
        return path,(None,None)
        
    def register(self,url,func):
        url_pattern = ''
        url_var = []

        for path,var in self.path_re.findall(url):
            path,var = self.get_dtype(path,var)
            url_pattern += '/' + path
            url_var.append(var)
            
        url_pattern = url_pattern if len(url_pattern) else url
        url_pattern += '$'
        self += [re.compile(url_pattern),func,url_var]
        
    def get(self,url):
        url,*query = url.split("?")
        for pattern,func,var in self:
            if pattern.match(url):
                return func,{name:dtype(val) for (name,dtype),(val,_) in zip(var,self.path_re.findall(url)) if name},query
        return False,None,None
        
class Request(object):
    header:Header = None
    writer:asyncio.StreamWriter = None
    reader:asyncio.StreamReader = None
    loop = None

    _content = None
    def __init__(
            self,
            header:Header,
            reader:asyncio.StreamReader,
            writer:asyncio.StreamWriter,
            loop,
        ):
        self.header = header
        self.reader = reader
        self.writer = writer
        self.loop = loop

    async def get_json(self,):
        if self._content:
            return loads(self._content)
        self._content = await self.reader.readexactly(n= int(self.header.content_length))
        return loads(self._content)

    @property
    async def content(self,):
        if self._content:
            return self._content
        self._content = await self.reader.readexactly(n= int(self.header.content_length))
        return self._content

CORS_RESPONSE = """HTTP/1.1 204 No Content
Server: TPI
Access-Control-Allow-Origin: {origin}
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive"""

class App(object):
    __router = Router()
    __rnrn = slice(0,-1)
    def __init__(self,):
        self.loop = asyncio.get_event_loop()

    def __add_route(self,func):
        self.__router.register(self.__route__,func)

    def route(self,path:str,*args,**kwargs):
        self.__route__ = path
        return self.__add_route 

    async def handle_request(self,reader:asyncio.StreamReader,writer:asyncio.StreamWriter):
        response = False
        try:
            header = await reader.read(1)
        except asyncio.IncompleteReadError:
            pass
        else:
            header += await reader.readuntil(separator=b'\r\n\r\n')
            header = RequestHeader().parse(str(header[self.__rnrn],encoding='utf-8'))
                
            if header.method == "OPTIONS":
                response = CORS_RESPONSE.format(origin=header.origin).encode()
            else:
                func,var,query = self.__router.get(header.path)
                if func:
                    response = await func(Request(header,reader,writer,self.loop),**var)
                else:
                    response = text_response(f'{header.path} not found !',404,'Not Found !')
                
            if response:
                writer.write( response )
                await writer.drain()
                writer.close()   
            # print (f'[{header.method}] {header.path}')

    def serve(self,host:str='localhost',port:int=8080):
        print (
            f"* Started App\n"
            f"* Host : {host}\n"
            f"* Port : {port}\n"
            f"* URL  : http://{host}:{port}"
        )
        self.loop.create_task(asyncio.start_server(self.handle_request,host,port))
        self.loop.run_forever()