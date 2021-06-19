import os
import cv2
import numpy as np
import pandas as pd
import tensorflow as tf

from tensorflow import keras
from typing import List


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
    meta = {
        
    }
    path = None

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """

        self.train_x = None
        self.train_y = None
        self.test_x = None
        self.test_y = None

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

    def __init__(self, name:str, meta:dict):
        super().__init__()
        self.name:str = name
        self.meta:dict = meta
        self.path:str = os.path.abspath(meta['config']['path'])
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

DATASETS = {
    "dataset":Dataset,
    "csv": CSVDataset,
}