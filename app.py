from tf_gui.web import App, Request, text_response, json_response
from tf_gui.web.headers import ResponseHeader
from tf_gui.builder import build_code
from tf_gui.trainer import  Trainer

from json import dump,load

app = App()
trainer = Trainer()

@app.route("/")
async def index(request:Request):
    return text_response("Hello, World !")

@app.route("/build",)
async def buiild(request:Request):
    if request.header.method == 'POST':
        build_config = await request.get_json()
        with open("./data/example_build.json","w+") as file:
            dump(build_config,file,)
        _,code = build_code(build_config)
        return json_response({
            "status":200,
            "code":code
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

@app.route("/graph")
async def status(request:Request):
    if request.header.method == 'GET':
        with open("./temp/build.json","r") as file:
            graph = load(file)
        return json_response({
            "status":True,
            "graph":graph
        })

    elif request.header.method == 'POST':
        build_config = await request.get_json()
        with open("./temp/build.json","w+") as file:
            dump(build_config,file,)
        return json_response({
            "status":True,
        })

    return json_response({
        "status":True,
    })


@app.route("/train",)
async def train(request:Request):
    if request.header.method == 'POST':
        data = await request.get_json()
        build_config,code = build_code(data,)
        trainer.logs = []
        trainer.start(build_config,code)
        return json_response({
            "status":"Training Started"
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