# import tensorflow as tf
import csv
import pandas as pd

# from tensorflow import keras
# from tensorflow.keras import layers,optimizers,losses
# from tensorflow.python.keras.engine.training import Model

from tf_gui.web import App, Request, text_response, json_response
from tf_gui.web.headers import ResponseHeader
from tf_gui.builder import build_model
# from tf_gui.trainer import  build_trainer

from pygments.lexers import Python3Lexer

from typing import List
from json import dump, dumps
from time import sleep,time
from _thread import start_new_thread
from os import path as pathlib

import sys

dataset_path = pathlib.abspath("data\\datasets\\mnist")
sys.path.append(dataset_path)

from dataset import Dataset

# class TfGui(keras.callbacks.Callback):
#     batch = None    
#     logs = []

#     def on_batch_end(self,batch,logs=None):
#         self.batch = batch
#         self.logs[self.epoch]['batch_log'] = logs
#         self.logs[self.epoch]['batch'] = batch + 1
#         self.trainer.update_id = time()

#     def on_epoch_end(self,epoch,logs=None):
#         self.logs[self.epoch]['epoch_log'] = logs

#     def on_epoch_begin(self, epoch, logs=None):
#         self.epoch = epoch
#         self.logs.append({
#             "epoch":epoch,
#             "batch_log":None,
#             "epoch_log":None
#         })

#     def reset(self,):
#         self.batch = None    
#         self.logs = []

# class Trainer(object):
#     build_config = {}
#     model = keras.Model
#     update_id = 0

#     def __init__(self):
#         self.dataset = Dataset()
#         self.dataset.train_y = keras.utils.to_categorical(self.dataset.train_y)
#         self.dataset.test_y = keras.utils.to_categorical(self.dataset.test_y)

#         self.status = TfGui()
#         self.status.trainer = self

#     def start(self,)->None:
#         callback = [ self.status, ]
#         self.model:keras.Model = self.build_config['train']['model_1']
#         self.model.fit(
#             x=self.dataset.train_x,
#             y=self.dataset.train_y,
#             epochs=self.dataset.epochs,
#             batch_size=self.dataset.batch_size,
#             verbose=1,
#             validation_data=(self.dataset.test_x,self.dataset.test_y),
#             callbacks=callback
#         )

#     def get_status(self,)->List[dict]:
#         return {
#             "status":self.status.logs,
#             "batchs":self.dataset.batches,
#             "epochs":self.dataset.epochs,
#             "update_id":trainer.update_id
#         }

app = App()
# trainer = Trainer()

@app.route("/")
async def index(request:Request):
    return text_response("Hello, World !")

@app.route("/build",)
async def buiild(request:Request):
    if request.header.method == 'POST':
        build_config = await request.get_json()
        with open("./data/example_build.json","w+") as file:
            dump(build_config,file,)
        # code = build_model(build_config)
        return json_response({
            "status":200,
            "code":""
        })
    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )

@app.route("/status")
async def status(request:Request):
    if request.header.method == "GET":
        return json_response(trainer.get_status())

    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )


@app.route("/train",)
async def train(request:Request):
    if request.header.method == 'POST':
        data = await request.get_json()
        build_config = build_trainer(data)
        
        trainer.build_config = build_config
        trainer.status.reset()

        start_new_thread(trainer.start,tuple())
        return json_response({
            "status":"Training Ended"
        })

    else:
        return json_response(
            data={"message":"Method Not Allowed"},
            status_code=401,
            message="Method Not Allowed !"
        )



# Language Server
@app.route("/code/highlight")
async def highlight_code(request:Request):
    data = await request.get_json()
    return json_response({
        "code": list(lexer.get_tokens(data['code'])) 
    })

if __name__ == "__main__":
    app.serve(
        port=80
    )