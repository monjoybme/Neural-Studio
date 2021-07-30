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
        raise NotImplementedError()

class ImageCaptioning(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()

class MachineTranslation(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()

class Summarization(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()

class QuestionAnswering(AbsDataset):
    def __init__(self) -> None:
        raise NotImplementedError()

