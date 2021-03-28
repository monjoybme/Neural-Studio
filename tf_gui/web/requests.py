from .__imports__ import asyncio,loads,dumps
from .headers import RequestHeader,Header,ResponseHeader

class Response(object):
    def __init__(self,):
        pass

class HTTPRequest(object):
    def __init__(
            self,
            method:str,
            host:str,
            port:int,
            path:str,
            json:dict=dict(),
            headers:dict=dict(),
            stream:bool=False
        ):
        
        self.stream = stream
        *_,self.host = host.split("//")
        self.port = int(port)

        self.__headers = RequestHeader()
        self.__headers.host = f"{self.host}:{self.port}"
        self.__headers.method = method.upper()
        self.__headers.path = path

        for key,val in headers.items():
            self.__headers[key.replace("_","-").title()] = val

        self.headers = None
        self.content = None
        self.json = dumps(json)
        self.__headers.content_length = len(self.json)

    async def make_request(self,):
        self.__reader,self.__writer = await asyncio.open_connection(
            host=self.host,
            port=self.port
        )
        
        self.__writer.write(self.__headers / self.json)
        self.headers =  ResponseHeader().parse((await self.__reader.readuntil(b'\r\n\r\n')).decode())
        if not self.stream and self.headers.content_length:
            self.content = await self.__reader.read(int(self.headers.content_length))
        
        await self.__writer.drain()
        return self

    @property 
    def reader(self,):
        return self.__reader

    def get_json(self,):
        return loads(self.content.decode()) 

    def close(self,):
        self.__writer.close()