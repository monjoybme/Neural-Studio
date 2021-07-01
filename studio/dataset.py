import os
import cv2
import numpy as np
import pandas as pd
import tensorflow as tf

from concurrent.futures import ThreadPoolExecutor
from tqdm.cli import tqdm
from glob import glob
from os import path as pathlib
from gc import collect

from tensorflow import keras
from typing import List

from .structs import DataDict
from .logging import Logger

class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes
    
    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    name = "Dataset"
    meta = DataDict()
    path = None

    def __init__(self, name: str, meta: dict) -> None:
        """
        Load dataset and set required variables.
        """

        self.train_x = None
        self.train_y = None
        self.test_x = None
        self.test_y = None

        self.name = name
        self.meta = DataDict(meta)
        self.logger = Logger("dataset")

    def apply(self, func: callable):
        _ = func(self)
        return { "status": True }

    def set_features(self, features: List[str] = [], callback: callable = None) -> bool:
        """
        Only applicable for CSV datasets.
        """
        pass

    def set_labels(self, labels: List[str] = [], callback: callable = None) -> bool:
        """
        Only applicable for CSV datasets.
        """
        pass

    def sample(self, n: int = 5) -> List[dict]:
        """
        When called sample function must return a list of samples 
        """
        pass


class CSVDataset(Dataset):

    def __init__(self, name:str, meta:dict, *args, **kwargs):
        super().__init__(name, meta)
        self.path:str = os.path.abspath(self.meta[['config:path']])
        self.dataframe: pd.DataFrame = pd.read_csv(self.path)

    def get_attribute(self, name: str, arguments: dict = {},):
        if name == 'sample':
            return {
                "status": True,
                "attribute": self.sample(**arguments)
            }
        else:
            return {
                "status": False
            }

    def sample(self, n: int = 5) -> dict:
        s = self.dataframe.sample(n)
        return {
            "columns": s.columns.to_list(),
            "values": s.values.astype(str).tolist()
        }

class ImageDatasetFromDirectory(Dataset):
    def __init__(self, name: str, meta: dict, *args, **kargs) -> None:
        super().__init__(name, meta)
        # Path to dataset folder
        self.root_folder = pathlib.abspath(
            self.meta[["config:path"]])  
        # Name of the train folder
        self.train_name = self.meta[["config:params:folders:train"]]
        # Name of the test folder
        self.val_name = self.meta[["config:params:folders:val"]]
        # Name of the test folder
        self.test_name = self.meta[["config:params:folders:test"]]

        # image size in ( height, width, channel ) format
        self.image_size = eval(self.meta[["config:params:image:size"]])
        # whether to resize the image after reading or not.
        self.resize = eval(self.meta[["config:params:image:resize"]])

        self.show_progress = eval(self.meta[["config:params:image:show_progress"]])

        # Make changed in the following code with the caution

        self.train_set = glob(pathlib.join(self.root_folder, self.train_name, "*", "*"))
        self.test_set  = glob(pathlib.join(self.root_folder, self.test_name, "*", "*"))

        self.train_labels = [self.strip_label(path) for path in self.train_set]
        self.test_labels  = [self.strip_label(path) for path in self.test_set]

        self.label_classes   = list(set(self.train_labels + self.test_labels))
        self.n_label_classes = len(self.label_classes)

        if self.n_label_classes > 2:
            self.train_y = keras.utils.to_categorical(
                np.array([
                    self.label_classes.index(label)
                    for label
                    in self.train_labels
                ]).reshape(-1, 1)
            )
            self.test_y = keras.utils.to_categorical(
                np.array([
                    self.label_classes.index(label)
                    for label
                    in self.test_labels
                ]).reshape(-1, 1)
            )
            self.output_shape = (self.image_size, self.n_label_classes)
        else:
            p, n = self.label_classes
            self.train_y = (
                np.array([self.train_labels]) == p).astype(np.uint8)
            self.test_y = (np.array([self.test_labels]) == p).astype(np.uint8)
            self.output_shape = (self.image_size, 1)

        self.train_x = self.read_image_set_with_bar(
            self.train_set) if self.show_progress else self.read_image_set(self.train_set)
        self.test_x = self.read_image_set_with_bar(
            self.test_set) if self.show_progress else self.read_image_set(self.test_set)

        _ = collect()

    def strip_label(self, path: str) -> str:
        path, _ = pathlib.split(path,)
        _, label = pathlib.split(path)
        return label

    def read_image(self, path: str) -> np.ndarray:
        im = cv2.imread(path, )
        im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
        h, w, c = self.image_size
        if self.resize:
            im = cv2.resize(im, (h, w), interpolation=cv2.INTER_AREA)
        return im

    def read_image_set(self, image_set: List[str]) -> np.ndarray:
        images = np.zeros(
            shape=(len(image_set), *self.image_size), dtype=np.uint8)
        with ThreadPoolExecutor(max_workers=32, ) as executor:
            def set_image(args):
                try:
                    idx, path = args
                    images[idx] = self.read_image(path)
                except Exception as e:
                    print(e)
            res = executor.map(set_image, enumerate(image_set))
        return images

    def read_image_set_with_bar(self, image_set: List[str]) -> np.ndarray:
        images = np.zeros(
            shape=(len(image_set), *self.image_size), dtype=np.uint8)
        with tqdm(total=len(image_set), desc="[dataset]") as bar:
            with ThreadPoolExecutor(max_workers=32, ) as executor:
                def set_image(args):
                    try:
                        idx, path = args
                        images[idx] = self.read_image(path)
                        bar.update()
                    except Exception as e:
                        print(e)
                res = executor.map(set_image, enumerate(image_set))
        return images

    def sample(self, n: int = 5) -> List[dict]:
        return {
            "sample":[],
            "info": {
                "n_train": len(self.train_x),
                "n_test": len(self.test_x),
                "n_val": 0, #len(self.test_x),
                "n_classes": self.n_label_classes
            }
        }

DATASETS = {
    "dataset":Dataset,
    "csv": CSVDataset,
    "imagedatasetfromdirectory": ImageDatasetFromDirectory
}
