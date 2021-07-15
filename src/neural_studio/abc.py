import numpy as np

from typing import List, Tuple

class Dataset:
    labels: List[str]
    train_X: np.ndarray
    train_y: np.ndarray
    test_x: np.ndarray
    test_y: np.ndarray
    size: Tuple[int, int, int]
    def sample(self, n: int = 5) -> List[dict]: ...
