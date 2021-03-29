from tf_gui.web import App, Request, text_response, json_response
from tf_gui.builder import build_model

from json import dump

app = App()

@app.route("/")
async def index(request:Request):
    print (text_response("HELLO"))
    return text_response("Hello, World !")

@app.route("/build",)
async def buiild(request:Request):
    if request.header.method == 'POST':
        build_config = await request.get_json()
        with open("./data/example_build.json","w+") as file:
            dump(build_config,file,)
        code = build_model(build_config)
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

if __name__ == "__main__":
    app.serve(
        port=80
    )