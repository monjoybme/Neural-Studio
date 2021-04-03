const datasets = {
    "name":"Input",
    "layers":[
        {
            "name":"Dataset",
            "type":"Dataset",
            "args":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.

All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""


#<dataset id=__id__>
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

        self.calculate_batches()
`,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"MNIST",
            "type":"Dataset",
            "args":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#<dataset id=__id__>
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

        (X,Y),(x,y) = keras.datasets.mnist.load_data()

        self.train_x = X.reshape(-1,784) / 255
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = X.reshape(-1,784) / 255
        self.test_y = keras.utils.to_categorical(Y)

#</dataset>
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        }
    ]
}

export default datasets;