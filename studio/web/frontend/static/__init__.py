import sys

from glob import glob
from os import path as pathlib

from pyrex import App, Request, ResponseHeader, types
from pyrex.core.headers import content_length, content_type
from pyrex.core.utils import not_found_error


class ServeCSS:
    stylesheets = {

    }
    url = "/static/css/<path:file>"

    def __init__(self, app: App, path: str = 'views') -> None:
        self.path = pathlib.abspath(path)
        sys.path.append(self.path)

        sheets = __import__("static.css", fromlist=['css'])
        for sheet in dir(sheets):
            if not sheet.startswith("__"):
                self.stylesheets[sheet] = getattr(sheets, sheet).stylesheet

        self.app = app
        self.app.router.register(self.url, self.view)

    async def view(self, request: Request, file: str) -> types.static:
        *_, sheet = file.split("/")
        sheet = self.stylesheets.get(sheet)
        if sheet:
            response = ResponseHeader() | 200
            response += content_length(len(sheet))
            response += content_type(".css")
            return response @ sheet
        return await not_found_error(request)


class ServeCSSDevelopment:
    stylesheets = {

    }
    url = "/static/css/<path:file>"

    def __init__(self, app: App, path: str = 'views') -> None:
        self.root = pathlib.abspath(path)
        self.app = app
        self.app._router.register(self.url, self.view)

        sys.path.append(self.root)

    async def view(self, request: Request, file: str) -> types.static:
        file = pathlib.join(self.root, *file.split("/"))
        file += '.py'

        if pathlib.isfile(file):
            with open(file, "r") as sheet:
                sheet = sheet.read()
                vars = {}
                exec(sheet, vars)
                sheet = vars.get("stylesheet")

            response = ResponseHeader() | 200
            response += content_length(len(sheet))
            response += content_type("css")
            return response @ sheet

        return await not_found_error(request)


class ServeViews:
    pass
