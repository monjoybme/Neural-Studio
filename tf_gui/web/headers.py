from .__imports__ import datetime

header_data_types = {
	'content_length':int,
    'chunk_size':int
}

class RequestHeader(object):
    __skip = ['method','path','protocol']
    def __init__(self,):
        self.method = 'GET'
        self.path = '/'
        self.protocol = 'HTTP/1.1'
        self.host = 'localhost'
        self.connection = 'keep-alive'
        self.cache_control = 'max-age=0'
        self.dnt = '1'
        self.content_length = 0
        self.upgrade_insecure_requests = '1'
        self.user_agent = 'TransferPi/1.0'
        self.accept = '*/*'
        self.accept_encoding = 'gzip, deflate, br'
        self.accept_language = 'en-US,en;q=0.9,hi;q=0.8'
        self.content_type = 'text/plain'
        self.access_control_allow_origin = "*"

    def __getitem__(self,key)->str:
        return self.__dict__[key]

    def __setitem__(self,key:str,value:str):
        self.__dict__[key] = value

    def __delitem__(self,key):
        del self.__dict__[key]  

    def __str__(self)->str:
        return str(self.encode(),encoding='utf-8')

    def __truediv__(self,data:str):
        return self.encode() +  data.encode()

    def __contains__(self,item):
        return item in self.__dict__

    def encode(self,)->str:
        header = f"{self.method} {self.path} HTTP/1.1\r\n"
        for key,val in self.__dict__.items():
            if key not in ['method','path','protocol']:
                header += f'{key.title().replace("_","-")}: {val}\r\n'
        header += '\r\n'
        return header.encode()

    def parse(self,header:str):
        self.status,*header = header.split("\r\n")
        self.method,self.path,self.protocol = self.status.split(" ")
        for head in header:
            try:
                key,val = head.split(": ")
                self[key.lower().replace("-","_")] = val
            except ValueError:
                pass
        return self
        
class ResponseHeader(object):
    """
    Fix dynamic date formating
    """
    def __init__(self,):
        self.access_control_allow_origin = '*'
        self.connection = 'Keep-Alive'
        self.content_length = 0
        self.content_type = 'text/html; charset=utf-8'
        self.keep_alive = 'timeout=5, max=997'
        self.server = 'TPI1.0'

        self.status_code = 200
        self.message = 'OK'    

    def __getitem__(self,key)->str:
        return self.__dict__[key]

    def __setitem__(self,key:str,value:str):
        self.__dict__[key] = value

    def __delitem__(self,key):
        del self.__dict__[key]  

    def __str__(self)->str:
        return str(self.encode(),encoding='utf-8')

    def __truediv__(self,data:str):
        return self.encode()  + data.encode()

    def __contains__(self,item):
        return item in self.__dict__

    def encode(self,):
        header = f"HTTP/1.1 {self.status_code} {''.join(self.message)}\r\n"
        for key,val in self.__dict__.items():
            if key not in ['status_code','message','status']:
                header += f'{key.title().replace("_","-")}: {val}\r\n'
        header += '\r\n'
        return header.encode()

    def parse(self,header:str):
        self.status,*header = header.split("\r\n")
        self.protocol,self.status_code,*self.message = self.status.split(" ")
        for head in header:
            try:
                key,val = head.split(": ")
                self[key.lower().replace("-","_")] = val
            except:
                pass
        return self

class Header:
    def __init__(self):
        self.method = None
        self.path = None
        self.access_control_allow_origin = "*"
        self.connection = None
        self.content_length = None
        self.content_type = None
        self.keep_alive = None
        self.status = None
        self.filename = None
        self.server = None
        self.content_encoding = None
        self.location = None
        self.date = None		
        self.host = None
        self.data = None

    def __getitem__(self,key)->str:
        return self.__dict__[key]

    def __setitem__(self,key:str,value:str):
        self.__dict__[key] = value

    def __delitem__(self,key):
        del self.__dict__[key]  

    def __str__(self)->str:
        return self.__encode__()

    def encode_request(self,)->str:
        header = f'{self.method} {self.path} {self.protocol}\r\n' 
        
    def encode_response(self)->str:
        header = f'{self.status}\r\n' 
        

    def parse_request(self,header:str):
        self.__encode__ = self.encode_request
        self.status,*header = header.split('\r\n')

        
    def parse_response(self,header):
        pass