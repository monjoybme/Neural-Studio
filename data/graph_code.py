#-*- Code generated by Tensorflow GUI -*-
#import
import pandas as pd
import numpy as np
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,callbacks,applications
#end-import

"""
Note : Don't change dataset id.

All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""


#dataset id=dataset_1
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    batch_size : int -> Batch size
    epochs : int -> Number of epochs
    batches : int -> Number of batches ( Will be calculated automatically )
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """

        self.train_x = None
        self.train_y = None
        self.test_x = None
        self.test_y = None

        self.x_shape = ( 224, 224, 3)

# Do not change the anything.
dataset_1 = Dataset()
#end-dataset id=dataset_1

input_1 = layers.Input(
    shape=(224, 224, 3),
    batch_size=None,
    name=None,
    dtype=None,
    sparse=False,
    tensor=None,
    ragged=False,
) #end-input_1


mobilenet_1 = applications.MobileNet(
    input_tensor=input_1,
    weights='imagenet',
    include_top=False
).output #end-mobilenet_1


globalmaxpooling2d_1 = layers.GlobalMaxPooling2D(
    data_format=None,
)(mobilenet_1) #end-globalmaxpooling2d_1


dense_1 = layers.Dense(
    units=1000,
    activation='softmax',
    use_bias=True,
    kernel_regularizer=None,
    bias_regularizer=None,
    activity_regularizer=None,
    kernel_constraint=None,
    bias_constraint=None,
)(globalmaxpooling2d_1) #end-dense_1


model_1 = keras.Model(
    [ input_1, ],
    [ dense_1, ]
) #end-model_1



model_1.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=["categorical_accuracy"]
) #end-compile_1



model_1.fit(
    x=dataset_1.train_x,
    y=dataset_1.train_y,
    batch_size=32,
    epochs=3,
) #end-train_1

