import numpy as np

from typing import List
from neural_studio.abc import AbsDataset


class ImageDataset(AbsDataset):
    """
    ImageDataset
    """
    root: str
    size: tuple
    normalize: bool
    resize: bool
    labels: list
    n_labels: int

    def __init__(
            self,
            size: tuple,
            normalize: bool,
            resize: bool,
    ) -> None:
        """
        Args:
            size: Size of the image
            normalize: Whether to normalize the image
            resize: Whether to resize the image
        """
        self.size = size
        self.normalize = normalize
        self.resize = resize
        self.labels = []
        self.n_labels = 0


class CSVDataset(AbsDataset):
    pass


class TextDataset(AbsDataset):
    pass


 