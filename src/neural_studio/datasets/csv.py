from ..abc import AbsDataset

__all__ = [
    "Classification",
    "Regression",
    "TimeSeries",
]

class Classification(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()

class Regression(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()

class TimeSeries(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()
