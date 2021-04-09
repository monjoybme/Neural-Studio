from tensorflow.python.util.tf_decorator import _has_tf_decorator_attr
from tf_gui.web import App, Request, text_response, json_response
from tf_gui.web.headers import ResponseHeader
from tf_gui.builder import build_code
from tf_gui.trainer import  Trainer,Summary

from json import dump,load,JSONDecodeError

app = App()
trainer = Trainer()
summary = Summary()

@app.route("/")
async def index(request:Request):
    return text_response("Hello, World !")

@app.route("/build",)
async def buiild(request:Request):
    if request.header.method == 'POST':
        try:
            build_config = await request.get_json()
            with open("./data/example_build.json","w+") as file:
                dump(build_config,file,)
            _,code = build_code(build_config)
            return json_response({
                "status":200,
                "code":code
            })
        except:
            return json_response({
                "status":200,
                "code":"""Error Generating Code"""
            })
    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )

@app.route("/status")
async def status(request:Request):
    return json_response({
        "status":True,
        "logs":trainer.logs
    })

@app.route("/graph/save")
async def status(request:Request):
    if request.header.method == 'POST':
        build_config = await request.get_json()
        with open(f"./temp/{build_config['name']}.json","w+") as file:
            dump(build_config['graph'],file,)
        return json_response({
            "status":True,
        })

    return json_response({
        "status":True,
    })


@app.route("/summary",)
async def train_start(request:Request):
    if request.header.method == 'POST':
        try:
            data = await request.get_json()
            build_config,code = build_code(data,)
            summ = summary.get(build_config,code)
            return json_response({
                "status":200,
                "summary":summ
            })
        except JSONDecodeError:
            return json_response(
            data={"message":"Can't read graph !"},
            status_code=200,
            message="Method Not Allowed !"
        )

    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )

@app.route("/train/start",)
async def train_start(request:Request):
    if request.header.method == 'POST':
        try:
            data = await request.get_json()
            trainer.logs = []
            trainer.start(data)
            return json_response({
                "status":"Training Started"
            })
        except JSONDecodeError:
            return json_response(
            data={"message":"Can't read graph !"},
            status_code=200,
            message="Method Not Allowed !"
        )

    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )

@app.route("/train/halt",)
async def train_halt(request:Request):
    if request.header.method == 'POST':
        data = await request.get_json()
        trainer.halt(state=data['state'])
        return json_response({
            "status":"Training Started"
        })

    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )

@app.route("/train/stop",)
async def train_stop(request:Request):
    if request.header.method == 'POST':
        try:
            trainer.stop()
            return json_response({
                "status":200,
                "message":"Training Stopped"
            })
        except AttributeError:
            return json_response({
                "status":200,
                "message":"Training hasn't statrted yet."
            }) 

    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )

if __name__ == "__main__":
    app.serve(
        port=80
    )