
from typing import Any, AnyStr, Iterator, List, Optional, Match, Tuple, Union, Callable


"""
:TODO

# define abstract meta classes for whole project.

"""

class Pattern:
    def __init__(self) -> None:...

    def match(self, string: AnyStr, pos: int, endpos: int) -> Optional[Match[AnyStr]]:...

    def findall(self, string: AnyStr, pos: int, endpos: int) -> List[Any]:...

    def finditer(self, string: AnyStr, pos: int, endpos: int) -> Iterator[Match[AnyStr]]:...

    def search(self, string: AnyStr, pos: int, endpos: int) -> Optional[Match[AnyStr]]:...

    def split(self, string: AnyStr, maxsplit: int) -> List[AnyStr]:...
