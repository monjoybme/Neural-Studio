from ..abc import AbsDataset

__all__ = [
    "Classification",
    "ImageCaptioning",
    "MachineTranslation",
    "Summarization",
    "QuestionAnswering",
]

class Classification(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

class ImageCaptioning(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

class MachineTranslation(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

class Summarization(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

class QuestionAnswering(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError(f"{self.__class__.__name__} Not implemented yet !")

