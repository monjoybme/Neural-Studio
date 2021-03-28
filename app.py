from flask import Flask,request,send_file,send_from_directory
from flask_cors import CORS
from json import dump

from tf_gui.builder import build_model

app = Flask(__name__)
CORS(app)

@app.route("/build",methods=['POST'])
def build_():
    with open("./data/example_build.json","w+") as file:
        dump(request.get_json(),file)

    return {
        "status":200,
        "code":build_model(request.get_json())
    }

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=80,
        debug=True
    )
