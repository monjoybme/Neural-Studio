from typing import List
import numpy as np
from tensorflow import keras

from ..utils import b64_to_numpy_image, numpy_image_to_b64
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
        self.labels = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
        ]

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "image",
            "problem": "Classification",
            "data": [
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(28, 28)),
                    "class": str(self.train_y[idx].argmax(-1))
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }

    def pre_process(self, data: dict) -> None:
        image = b64_to_numpy_image(data["image"])
        return image.reshape(1, *self.size)

    def post_inference(self, prediction: np.ndarray) -> dict:
        prediction,  = prediction
        label_class = self.labels[np.argmax(prediction, axis=-1)]
        probabilities = list(map(float, prediction))
        return {
            "type": "image",
            "problem": "Classification",
            "label": label_class,
            "probabilities": probabilities,
            "labels": self.labels
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

    def __init__(self, size: tuple = (13,)):
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.boston_housing.load_data()

        self.train_x = X
        self.train_y = Y
        self.test_x = x
        self.test_y = y
        self.size = size
        

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "image",
            "problem": "Classification",
            "data": [
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(28, 28)),
                    "class": str(self.train_y[idx].argmax(-1))
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }


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

    def __init__(self, size: tuple = (32, 32, 3), normalize: bool = True) -> None:
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.cifar10.load_data()

        self.train_x = X.reshape(-1, *size) / (255. if normalize else 1.)
        self.train_y = keras.utils.to_categorical(Y.reshape(-1,1))
        self.test_x = x.reshape(-1, *size) / (255. if normalize else 1.)
        self.test_y = keras.utils.to_categorical(Y.reshape(-1,1))
        self.size = size
        self.labels = [
            "airplane",
            "automobile",
            "bird",
            "cat",
            "deer",
            "dog",
            "frog",
            "horse",
            "ship",
            "truck",
        ]

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "image",
            "problem": "Classification",
            "data": [
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(*self.size)[:, :, ::-1]),
                    "class": self.labels[self.train_y[idx].argmax(-1)]
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }


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

    def __init__(self, size: tuple = (32, 32, 3), normalize: bool = True) -> None:
        """
        Load dataset and set required variables.
        """

        (X, Y), (x, y) = keras.datasets.cifar100.load_data()

        self.train_x = X.reshape(-1, *size) / (255. if normalize else 1.)
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1, *size) / (255. if normalize else 1.)
        self.test_y = keras.utils.to_categorical(y)

        self.size = size
        self.labels = [
            'apple', 'aquarium_fish', 'baby', 'bear', 'beaver', 'bed', 'bee', 
            'beetle', 'bicycle', 'bottle', 'bowl', 'boy', 'bridge', 'bus', 
            'butterfly', 'camel', 'can', 'castle', 'caterpillar', 'cattle', 
            'chair', 'chimpanzee', 'clock', 'cloud', 'cockroach', 'couch', 
            'crab', 'crocodile', 'cup', 'dinosaur', 'dolphin', 'elephant', 
            'flatfish', 'forest', 'fox', 'girl', 'hamster', 'house', 'kangaroo', 
            'keyboard', 'lamp', 'lawn_mower', 'leopard', 'lion', 'lizard', 
            'lobster', 'man', 'maple_tree', 'motorcycle', 'mountain','mouse', 
            'mushroom', 'oak_tree', 'orange', 'orchid', 'otter', 'palm_tree', 
            'pear', 'pickup_truck', 'pine_tree', 'plain', 'plate', 'poppy', 
            'porcupine', 'possum', 'rabbit', 'raccoon', 'ray', 'road', 'rocket', 
            'rose', 'sea', 'seal', 'shark', 'shrew', 'skunk', 'skyscraper', 
            'snail', 'snake', 'spider', 'squirrel', 'streetcar', 'sunflower', 
            'sweet_pepper', 'table', 'tank', 'telephone', 'television', 'tiger', 
            'tractor', 'train', 'trout', 'tulip', 'turtle', 'wardrobe', 'whale', 
            'willow_tree', 'wolf', 'woman', 'worm'
        ]

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "image",
            "problem": "Classification",
            "data": [
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(*self.size)[:, :, ::-1]),
                    "class": self.labels[self.train_y[idx].argmax(-1)]
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }


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
        self.labels = [
            "T-shirt/top",
            "Trouser",
            "Pullover",
            "Dress",
            "Coat",
            "Sandal",
            "Shirt",
            "Sneaker",
            "Bag",
            "Ankle boot",
        ]

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "image",
            "problem": "Classification",
            "data": [
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(28, 28)),
                    "class": self.labels[self.train_y[idx].argmax(-1)]
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }
