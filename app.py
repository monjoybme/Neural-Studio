from flask import Flask,request,send_file,send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

