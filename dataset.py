from re import S
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split

class Dataset:
    train_x = np.ndarray
    test_x = np.ndarray
    train_y = np.ndarray
    test_y = np.ndarray

    batch_size = 32
    epochs = 3
    batches = 0

    def __init__(self) -> None:
        data = pd.read_csv("data\datasets\mnist\\train.csv\\train.csv")
        labels = data.pop("label")
        features = data.values.reshape(-1,28,28,1) / 255
        self.train_x,self.test_x,self.train_y,self.test_y = train_test_split(features,labels,test_size=0.3)

        self.calculate_batches()

    def calculate_batches(self,):
        self.batches = np.ceil(len(self.train_x)/self.batch_size)

if __name__ == "__main__":
    dataset = Dataset()