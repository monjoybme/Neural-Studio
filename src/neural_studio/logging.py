import os

from sys import stdout, exc_info
from datetime import datetime
import sys


COLORS = {
    "reset": "\u001b[0m",
    "red": "\u001b[31m",
    "black": "\u001b[30m",
    "green": "\u001b[32m",
    "yellow": "\u001b[33m",
    "blue": "\u001b[34m",
    "white": "\u001b[37m",
}

BACKGROUNDS = {
    "black": "\u001b[40m",
    "red": "\u001b[41m",
    "green": "\u001b[42m",
    "yellow": "\u001b[43m",
    "blue": "\u001b[44m",
    "magenta": "\u001b[45m",
    "cyan": "\u001b[46m",
    "white": "\u001b[47m",
}

def set_log_output(output):
    globals().update({
        "LOGGER_OUTPUT": output,
    })

class header:
    color = COLORS.get("white")

class info(header):
    color = COLORS.get("blue")

class warning(header):
    color = COLORS.get("yellow")

class error(header):
    color = COLORS.get("red")

class sucess(header):
    color = COLORS.get("green")

class Logger:

    def __init__(self, name: str= ''):
        self.name = name
        self.output = globals().get("LOGGER_OUTPUT", stdout)

    def col_size(self,)->int:
        try:
            col, _ = os.get_terminal_size()
        except OSError:
            col = 80
        return col

    def log(self, msg: str, header: header = header) -> str:
        t = datetime.now().strftime("%Y-%m-%d %X")
        msg = f'[{header.color}{self.name}{COLORS.get("reset")}] {msg}'
        col  = self.col_size()
        self.output.write(f'{msg} {" "*(col-len(msg)-len(t))} [{t}]\n')

    def warning(self, msg:str)->None:
        self.log(msg, warning)

    def error(self, msg: str) -> None:
        self.log(msg, error)

    def success(self, msg: str) -> None:
        self.log(msg, sucess)

    def sys_error(self, e) -> None:
        exc_type, exc_obj, exc_tb = exc_info()
        _, file = os.path.split(exc_tb.tb_frame.f_code.co_filename)
        msg = f"{repr(e)} @ line {exc_tb.tb_lineno}, {file}"
        self.log(msg, error)