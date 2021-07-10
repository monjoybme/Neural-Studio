import os
import cv2
import numpy as np
import pandas as pd
import tensorflow as tf

from tensorflow import keras 
from typing import List

from os import path as pathlib
from glob import glob
from tqdm.cli import tqdm
from concurrent.futures import ThreadPoolExecutor
from gc import collect

from inspect import getfullargspec

__all__ = [
    "ImageClassificationDatasetFromDirectory"
]

class ImageClassificationDatasetFromDirectory:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    Image dataset from directory
    
    the root folder needs to be in following pattern.
    
    root
     |_ train_folder
       |_ class_1
         |_ image1.jpg
         |_ ...
       |_ class_2
         |_ image1.jpg
         |_ ...
       |_ ...
    |_ test_folder
       |_ class_1
         |_ image1.jpg
         |_ ...
       |_ class_2
         |_ image1.jpg
         |_ ...
       |_ ...
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    def __init__(self, root: str, size: tuple, resize: bool = True, show_progress: bool = True) -> None:
        """
        Load dataset and set required variables.
        """

        self.root_folder = pathlib.abspath(root)  # Path to dataset folder
        self.train_name = 'train'  # Name of the train folder
        self.test_name = 'test'  # Name of the test folder

        # image size in ( height, width, channel ) format
        self.image_size = size
        # whether to resize the image after reading or not.
        self.resize = resize

        self.show_progress = show_progress

        # Make changed in the following code with the caution

        self.train_set = glob(pathlib.join(
            self.root_folder, self.train_name, "*", "*"))[::4]
        self.test_set = glob(pathlib.join(
            self.root_folder, self.test_name, "*", "*"))[::4]

        self.train_labels = [self.strip_label(path) for path in self.train_set]
        self.test_labels = [self.strip_label(path) for path in self.test_set]

        self.label_classes = list(set(self.train_labels + self.test_labels))
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
        with tqdm(total=len(image_set)) as bar:
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
