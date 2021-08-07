from concurrent.futures import ThreadPoolExecutor
from os import path as pathlib
from glob import glob
from typing import List

import numpy as np
from numpy.core import multiarray
import tensorflow as tf

from neural_studio.abc import AbsDataset

__all__ = [
    "TextClassificationFromDirectory",
    "Classification",
    "ImageCaptioning",
    "MachineTranslation",
    "Summarization",
    "QuestionAnswering",
]


class TextClassificationFromDirectory(AbsDataset):

    vocab: List[str]
    multiclass: bool

    def __init__(self, root: str) -> None:
        self.root = pathlib.abspath(root)
        self.train_folder = pathlib.join(self.root, "train")
        self.test_folder = pathlib.join(self.root, "test")
        self.vocab = []

        train_files = glob(pathlib.join(
            self.train_folder, "*", "*"))
        test_files = glob(pathlib.join(
            self.test_folder, "*", "*"))

        with ThreadPoolExecutor(max_workers=16) as executor:
            train_labels = list(executor.map(self.strip_label, train_files))
            test_labels = list(executor.map(self.strip_label, test_files))
            train_data = list(executor.map(self.read_file, train_files))
            test_data = list(executor.map(self.read_file, test_files))

            self.labels = sorted(list(set(train_labels)))
            self.n_labels = len(self.labels)

            if self.n_labels <= 2:
                self.multiclass = False
                train_labels = np.array(list(executor.map(
                    lambda x: x == self.labels[0],
                    train_labels
                )))
                test_labels = np.array(list(executor.map(
                    lambda x: x == self.labels[0],
                    test_labels
                )))

            else:
                self.multiclass = True
                train_labels = np.array(list(executor.map(
                    lambda x: tf.keras.utils.to_categorical(
                        x, num_classes=self.n_labels),
                    train_labels
                )))
                test_labels = np.array(list(executor.map(
                    lambda x: tf.keras.utils.to_categorical(
                        x, num_classes=self.n_labels),

                    test_labels
                )))

        self.train_x = train_data
        self.train_y = train_labels
        self.test_x = test_data
        self.test_y = train_labels

    def strip_label(self, file: str) -> str:
        *_, label, _ = file.split(pathlib.sep)
        return label

    def read_file(self, path: str, *args, **kwargs) -> str:
        with open(path, encoding="utf8") as file:
            text = file.read()
            self.update_vocab(text)
            return text

    def update_vocab(self, text: str) -> None:
        self.vocab += list(set(text.split(" ")))

    def sample(self, n: int) -> List[dict]:
        return {
            "type": "text",
            "problem": "Classification",
            "data": [
                {
                    "text": self.train_x[idx],
                    "class": self.labels[self.train_y[idx].argmax(-1) if self.multiclass else self.train_y[idx]]
                }
                for idx
                in np.random.randint(0, len(self.train_x), n)
            ]
        }


class Classification(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(
            f"{self.__class__.__name__} Not implemented yet !")


class ImageCaptioning(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(
            f"{self.__class__.__name__} Not implemented yet !")


class MachineTranslation(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(
            f"{self.__class__.__name__} Not implemented yet !")


class Summarization(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(
            f"{self.__class__.__name__} Not implemented yet !")


class QuestionAnswering(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(
            f"{self.__class__.__name__} Not implemented yet !")


def test():
    tcd = TextClassificationFromDirectory(
        root="C:\\workspace\\tensorflow-gui\\data\\datasets\\imdb")

    print(tcd.train_y.shape, tcd.test_y.shape, len(tcd.vocab))


if __name__ == "__main__":
    test()
