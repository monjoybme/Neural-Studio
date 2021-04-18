import inspect
import re
from sys import path
import zipfile

from tf_gui.web import App, Request, text_response, json_response
from tf_gui.web.utils import send_file
from tf_gui.web.headers import Header
from tf_gui.builder import build_code
from tf_gui.trainer import  Trainer,Summary

from json import dump,JSONDecodeError
from os import chdir, path as pathlib
from glob import glob

app = App()
trainer = Trainer()
summary = Summary()

model_download_name = ""

def generate_args(code)->dict:
    exec(code)
    ret = locals()
    ret.pop("code")
    return ret

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
        except NameError as e:
            return json_response({
                "status":200,
                "code":f"""Error : {str(e)}"""
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


@app.route("/model/download/<string:form>")
async def model_download_format(request:Request,form:str):
    if request.header.method == "GET":
        return await send_file(pathlib.abspath(globals()['model_download_name'],),request)

    elif request.header.method == "POST":
        model = trainer.get_model();
        if model:
            if form == "pb":
                model.save("./models/model/")
                with zipfile.ZipFile("./models/model.zip","w") as zfile:
                    chdir("./models/model/")
                    zfile.write("./saved_model.pb")
                    for f in glob("./assets/*"):
                        zfile.write(f)
                    for f in glob("./variables/*"):
                        zfile.write(f)    
                globals()['model_download_name'] = './models/model.zip'

            elif form == "hdf5":
                model.save("./models/model.hdf5")
                globals()['model_download_name'] = './models/model.hdf5'

            elif form == "json":
                with open("./models/model.json","w+") as file:
                    file.write(model.to_json())    
                globals()['model_download_name'] = './models/model.json'
                
            return json_response({
                "status":True,
                "message":"Download Will Begin Shortly !"
            })

        return json_response({
            "status":False,
            "message":"Please build and train model before downloading."
        })

    return json_response({
        "message":"Method Not Allowed !"
    },status_code=200)

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


@app.route("/node/build")
async def node_build(request:Request):
    if request.header.method == "POST":
        data = await request.get_json()
        (function_id,function), = generate_args(data['code']).items()
        fullspecs = inspect.getfullargspec(function)
        arguments = { }

        for arg, val in zip(fullspecs.args, fullspecs.defaults):
            arguments[arg] = {
                "value": val,
                "type": re.sub("(<)|(>)|(')|(class)|( )","",str(fullspecs.annotations[arg])),
                "render": "text",
                "options": None,

            }
        return json_response({
            "status":200,
            "id":function_id,
            "arguments":arguments
        })

    return json_response({
        "message":"Method not allowed",
    },status_code=400)


if __name__ == "__main__":
    app.serve(
        port=80
    )


# def conv_2d(
#     inbound:list = [],
#     kernel_size:int=3,
#     filters:int=8,
#     strides:int=1,
#     padding:str="same",
#     activation:str="swish"
#   )->None:

#     x = layers.Conv2D(filters, kernel_size, strides=strides, padding=padding)(inbound)
#     x = layers.BatchNormalization()(x)
#     x = layers.Activation(activation)(x)

#     return x
  