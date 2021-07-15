from os import path as pathlib
from glob import glob
from typing import Union

from ..core.headers import ResponseHeader, content_length, content_type, access_control_allow_origin
from ..core.utils import template_not_found_error


class ServeHTML:
    def __init__(self, path: str = "./") -> None:
        self._path = pathlib.abspath(path)

    async def get(self, idx: str) -> Union[bytes, bool]:
        file = pathlib.join(self._path, idx)
        if pathlib.isfile(file):
            with open(file, "rb") as template:
                content = template.read().decode()
                response = ResponseHeader() | 200
                response.update(
                    content_length(len(content)),
                    content_type("html"),
                    access_control_allow_origin(),
                )
                return response @ content

        return await template_not_found_error(idx)


class ServeStatic:
    def __init__(self, path: str = "./") -> None:
        self._path = pathlib.abspath(path)

    async def get(self, idx: str) -> Union[bytes, bool]:
        file = pathlib.join(self._path, idx)
        *_, ext = file.split(".")
        if pathlib.isfile(file):
            with open(file, "rb") as template:
                content = template.read().decode()
                response = ResponseHeader() | 200
                response.update(
                    content_length(len(content)),
                    content_type(ext),
                    access_control_allow_origin(),
                )
                return response @ content

        return await template_not_found_error(idx)
