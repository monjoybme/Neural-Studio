from justwatch.proctypes import Process
from justwatch.skip import endswith, folder
from justwatch.watcher import Watcher
from justwatch.handlers import HandleAll
from justwatch import Path

watcher = Watcher(
    handle=HandleAll(
        process= Process(
            trigger= ['python', 'app.py']
        ),
        skip= [
            folder("__pycache__"),
            folder("html"),
            folder("notebooks"),
            folder("data"),
            folder("docs"),
            folder("templates"),
            folder("temp"),
            folder("watch.py"),
            folder(".tfstudio"),
            endswith(".pyc"),
            folder(".git")
        ]
    ),
    path= Path("./")
)

watcher.start().observe()

