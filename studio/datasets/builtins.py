from typing import List
import numpy as np
from tensorflow import keras

from ..utils import numpy_image_to_b64
from ..abc import Dataset

__all__ = [
    'Mnist',
    "BostonHousing",
    "Cifar10",
    "Cifar100",
    "FashionMnist"
]



class Mnist(Dataset):
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

    def __init__(self, size: tuple = (28, 28, 1), normalize: bool = True):
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.mnist.load_data()
        self.train_x = X.reshape(-1, *size) / (255. if normalize else 1.)
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1,  *size) / (255. if normalize else 1.)
        self.test_y = keras.utils.to_categorical(y)

        self.size = size

    def sample(self, n: int) -> List[dict]: 
        return {
            "type":"image",
            "problem": "Classification",
            "data":[
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(28, 28)),
                    "class": str(self.train_y[idx].argmax(-1))
                }
                for idx 
                in np.random.randint(0, len(self.train_x), n)
            ]
        }


class BostonHousing(Dataset):
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

    def __init__(self, size: tuple = (13,) ):
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.boston_housing.load_data()

        self.train_x = X
        self.train_y = Y
        self.test_x = x
        self.test_y = y

        self.size = size


class Cifar10(Dataset):
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

    def __init__(self, size: tuple = (32, 32, 1), normalize: bool = True) -> None:
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.cifar10.load_data()

        self.train_x = X.reshape(-1, *size ) / (255. if normalize else 1.)
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1, *size ) / (255. if normalize else 1.)
        self.test_y = keras.utils.to_categorical(y)

        self.size = size


class Cifar100(Dataset):
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

    def __init__(self, size: tuple = (32, 32, 1), normalize: bool = True) -> None:
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.cifar100.load_data()

        self.train_x = X.reshape(-1, *size) / (255. if normalize else 1.)
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1, *size) / (255. if normalize else 1.)
        self.test_y = keras.utils.to_categorical(y)

        self.size = size


class FashionMnist(Dataset):
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

    def __init__(self, size: tuple = (28, 28, 1), normalize: bool = True):
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.fashion_mnist.load_data()
        self.train_x = X.reshape(-1, *size) / (255. if normalize else 1.)
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1,  *size) / (255. if normalize else 1.)
        self.test_y = keras.utils.to_categorical(y)

        self.size = size
