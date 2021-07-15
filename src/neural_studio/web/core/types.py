from typing import Callable
from .structs import *
from .utils import *
from .headers import *


class ViewTypeDef:
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        pass

    async def write(self, request: Request, response: bytes) -> bool:
        request.writer.write(response)
        await request.writer.drain()
        request.writer.close()


class type_dict(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        view_response = await json_response(
            await view(request, **url_var)
        )
        await self.write(request, view_response)


class type_str(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        view_response = await text_response(
            await view(request, **url_var)
        )
        await self.write(request, view_response)


class type_view(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        view_response = await view(request, **url_var)
        view_response = await render_view(str(view_response))
        await self.write(request, view_response)


class type_sock(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        try:
            await view(request, **url_var)
        except AttributeError:
            response = await json_response({
                "message": "missing headers"
            }, code=428)
            await self.write(request, response)


class type_error(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        view_response = await view(request, **url_var)
        await self.write(request, view_response)


class type_static(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        view_response = await view(request, **url_var)
        await self.write(request, view_response)


class type_template(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        view_response = await view(request, **url_var)
        await self.write(request, view_response)


class type_abc(ViewTypeDef):
    async def handle(self, view: Callable, request: Request, url_var: dict, queries: dict) -> bool:
        await view(request, **url_var)


class types:
    dict = type_dict()
    str = type_str()
    list = type_dict()
    file = type_abc()
    websocketserver = type_sock()
    view = type_view()
    static = type_static()
    template = type_template()


types = types() 


def test():
    pass


if __name__ == "__main__":
    test()
