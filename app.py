from tf_gui import web
from tf_gui.web.utils import send_file
from tf_gui.web.headers import Header
from tf_gui.web import App, Request, text_response, json_response
from tf_gui.builder import build_code
from tf_gui.trainer import  Trainer,Summary

from json import dump,JSONDecodeError,dumps

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
        with open(f"./temp/{build_config['file']}.json","w+") as file:
            dump(build_config['graph'],file,)
        return json_response({
            "status":True,
        })

    return json_response({
        "status":True,
    })


@app.route("/model/summary",)
async def summary_viewer(request:Request):
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
        except:
            return json_response({
                "status":200,
                "summary":[ [ 'Error building model', ], ]
            })

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
            # if trainer.training:
            #     trainer.update_log(log_type="notif",log={ "message":"Stopping Previous Training Session" })
            #     trainer.stop(end=False)
            #     trainer.logs = []
            trainer.training = True
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
            "status":"Training Halt"
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
                "message":"Interrupting Training"
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