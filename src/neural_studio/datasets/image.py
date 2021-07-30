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

from pyrex.core.abs import AbsForm

from ..abc import AbsDataset
from ..utils import numpy_image_to_b64, b64_to_numpy_image

__all__ = [
    "ImageSegmentationDatasetFromDirectory",
    "ImageClassificationDatasetFromDirectory",
    "ObjectDetection",
    "StyleTransfer",
    "Colorization",
    "Reconstruction",
    "SuperResolution",
]


class ImageClassificationDatasetFromDirectory(AbsDataset):
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

    def __init__(self,
                 root: str,
                 size: tuple,
                 train_folder: str = "train",
                 test_folder: str = "test",
                 resize: bool = True,
                 show_progress: bool = True
                 ) -> None:
        """
        Load dataset and set required variables.
        """

        self.root_folder = pathlib.abspath(root)  # Path to dataset folder
        self.train_name = train_folder  # Name of the train folder
        self.test_name = test_folder  # Name of the test folder

        # image size in ( height, width, channel ) format
        self.size = size
        # whether to resize the image after reading or not.
        self.resize = resize

        self.show_progress = show_progress

        # Make changed in the following code with the caution

        self.train_set = glob(pathlib.join(
            self.root_folder, self.train_name, "*", "*"))
        self.test_set = glob(pathlib.join(
            self.root_folder, self.test_name, "*", "*"))

        self.train_labels = [self.strip_label(path) for path in self.train_set]
        self.test_labels = [self.strip_label(path) for path in self.test_set]

        self.labels = list(set(self.train_labels + self.test_labels))
        self.n_labels = len(self.labels)

        if self.n_labels > 2:
            self.train_y = keras.utils.to_categorical(
                np.array([
                    self.labels.index(label)
                    for label
                    in self.train_labels
                ]).reshape(-1, 1)
            )
            self.test_y = keras.utils.to_categorical(
                np.array([
                    self.labels.index(label)
                    for label
                    in self.test_labels
                ]).reshape(-1, 1)
            )
            self.output_shape = (self.size, self.n_labels)
        else:
            p, n = self.labels
            self.train_y = (
                np.array([self.train_labels]) == p).astype(np.uint8)
            self.test_y = (np.array([self.test_labels]) == p).astype(np.uint8)
            self.output_shape = (self.size, 1)

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
        h, w, c = self.size
        if self.resize:
            im = cv2.resize(im, (h, w), interpolation=cv2.INTER_AREA)
        return im

    def read_image_set(self, image_set: List[str]) -> np.ndarray:
        images = np.zeros(
            shape=(len(image_set), *self.size), dtype=np.uint8)
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
            shape=(len(image_set), *self.size), dtype=np.uint8)
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

    def pre_process(self, data: dict) -> np.ndarray:
        image = b64_to_numpy_image(data["image"])
        image = cv2.resize(image, self.size[:2])
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

    def pre_process_public(self, form: AbsForm) -> dict:
        return {
            "image": b64.b64encode(form.files['image'].content).decode()
         }


class ImageSegmentationDatasetFromDirectory(AbsDataset):
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training mask
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing mask

    validate : bool -> Weather use validation data or not

    Image dataset from directory

    the root folder needs to be in following pattern.

    root
        |_ train_images
            |_ image1.jpg
            ...
        |_ train_mask
            |_ image1.jpg
            ...
        |_ test_image
            |_ image10.jpg
            ...
        |_ test_mask
            |_ image10.jpg
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    def __init__(
        self,
        root: str,
        size: tuple,
        train_images: str = "train_images",
        train_masks: str = "train_masks",
        test_images: str = "test_images",
        test_masks: str = "test_masks",
        normalize: bool = True,
        binary_mask: bool = True,
        resize: bool = True,
        show_progress: bool = True
    ) -> None:
        """
 
        """

        self.root = pathlib.abspath(root)  # Path to dataset folder
        self.train_images = train_images  # Folder for train_images
        self.train_masks = train_masks  # Folder for train_masks
        self.test_images = test_images  # Folder for test_images
        self.test_masks = test_masks  # Folder for test_masks

        self.size = size  # image size in ( height, width, channel ) format
        # whether to resize the image after reading or not.
        self.resize = resize

        self.binary_mask = binary_mask
        self.show_progress = show_progress
        self.normalize = normalize

        # Make changed in the following code with the caution

        self.train_images_set = sorted(
            glob(pathlib.join(self.root, self.train_images, "*")))
        self.train_masks_set = sorted(
            glob(pathlib.join(self.root, self.train_masks, "*")))
        self.test_images_set = sorted(
            glob(pathlib.join(self.root, self.test_images, "*")))
        self.test_masks_set = sorted(
            glob(pathlib.join(self.root, self.test_masks, "*")))

        assert len(self.train_images_set) == len(
            self.train_masks_set), "Number of training images and masks should be same"
        assert len(self.test_images_set) == len(
            self.test_masks_set), "Number of testing images and masks should be same"

        self.train_x = (
            self.read_image_set_with_bar(self.train_images_set)
            if self.show_progress
            else self.read_image_set(self.train_images_set)
        ) / (255 if self.normalize else 1)

        self.train_y = (
            self.read_image_set_with_bar(self.train_masks_set)
            if self.show_progress
            else self.read_image_set(self.train_masks_set)
        ) / (255 if self.normalize else 1)

        self.test_x = (
            self.read_image_set_with_bar(self.test_images_set)
            if self.show_progress
            else self.read_image_set(self.test_images_set)
        ) / (255 if self.normalize else 1)

        self.test_y = (
            self.read_image_set_with_bar(self.test_masks_set)
            if self.show_progress
            else self.read_image_set(self.test_masks_set)
        ) / (255 if self.normalize else 1)

        if self.binary_mask:
            self.train_y = self.train_y.mean(
                axis=-1).reshape(-1, *self.size[:-1], 1)
            self.test_y = self.test_y.mean(
                axis=-1).reshape(-1, *self.size[:-1], 1)

        _ = collect()

    def read_image(self, path: str) -> np.ndarray:
        im = cv2.imread(path, )
        im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
        h, w, c = self.size
        if self.resize:
            im = cv2.resize(im, (w, h), interpolation=cv2.INTER_AREA)
        return im

    def read_image_set(self, image_set: List[str]) -> np.ndarray:
        images = np.zeros(shape=(len(image_set), *self.size), dtype=np.uint8)
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
        images = np.zeros(shape=(len(image_set), *self.size), dtype=np.uint8)
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

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "image",
            "problem": "Segmentation",
            "data": [
                {
                    "image": numpy_image_to_b64(self.train_x[idx].reshape(*self.size)[:, :, ::-1]),
                    "mask": numpy_image_to_b64((
                        self.train_y[idx].reshape(*self.size[:-1])
                            if self.binary_mask
                            else self.train_y[idx].reshape(*self.size)[:, :, ::-1]                        
                    ))
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }


class ObjectDetection(AbsDataset):
    def __init__(self, *args, **kwargs) -> None:
        raise NotImplementedError()


class StyleTransfer(AbsDataset):
    def __init__(self, *args, **kwargs) -> None:
        raise NotImplementedError()


class Colorization(AbsDataset):
    def __init__(self, *args, **kwargs) -> None:
        raise NotImplementedError()
        

class Reconstruction(AbsDataset):
    def __init__(self, *args, **kwargs) -> None:
        raise NotImplementedError()

class SuperResolution(AbsDataset):
    def __init__(self, *args, **kwargs) -> None:
        raise NotImplementedError()