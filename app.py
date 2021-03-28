from tf_gui.web import App, Request, text_response, json_response
from tf_gui.builder import build_model

app = App()

@app.route("/")
async def index(request:Request):
    print (text_response("HELLO"))
    return text_response("Hello, World !")

@app.route("/build",)
async def buiild(request:Request):
    if request.header.method == 'POST':
        return json_response({
            "status":200,
            "code":"Hello"
        })

if __name__ == "__main__":
    app.serve(
        port=80
    )