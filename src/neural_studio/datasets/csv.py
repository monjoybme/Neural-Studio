from neural_studio.abc import AbsDataset

__all__ = [
    "Classification",
    "Regression",
    "TimeSeries",
]

class Classification(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

class Regression(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

class TimeSeries(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")
