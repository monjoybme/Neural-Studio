import zipfile
import numpy as np
import base64 as b64
import cv2
import psutil
import GPUtil

from os import path as pathlib, mkdir, chdir
from shutil import rmtree
from glob import glob

from neural_studio.abc import AbsTrainer, AbsWorkspace


def get_hardware_utilization() -> dict:
    """
    Get the hardware utilization of the current machine

    Returns:
        dict: The hardware utilization of the current machine
    """
    try:
        gpu, = GPUtil.getGPUs()
        cpu_load = psutil.cpu_percent()
        cpu_ram = psutil.virtual_memory().percent
        gpu_load = gpu.load*100
        gpu_ram = 100 * gpu.memoryUsed / gpu.memoryTotal
        usage_string = f"cpu : {cpu_load:0.2f}% | memory : {cpu_ram:0.2f}% | gpu : {gpu_load:0.2f}% | gpu memory : {gpu_ram:0.2f}%"
        return {
            "cpu": cpu_load,
            "memory": cpu_ram,
            "gpu": gpu_load,
            "gpu_memory": gpu_ram,
            "usage_string": usage_string
        }
    except:
        cpu_load = psutil.cpu_percent()
        cpu_ram = psutil.virtual_memory().percent
        usage_string = f"cpu : {cpu_load:0.2f}% | memory : {cpu_ram:0.2f}% | gpu : NA | gpu memory : NA"
        return {
            "cpu": cpu_load,
            "memory": cpu_ram,
            "gpu": "NA",
            "gpu_memory": "NA",
            "usage_string": usage_string
        }



def numpy_image_to_b64(image: np.ndarray) -> str:
    """
    Convert a numpy image to base64

    Args:
        image (np.ndarray): The image to convert
    Returns:
        str: The base64 string
    """
    image = (image * (255 if image.max() <= 1 else 1)).astype(np.uint8)
    _, buffer = cv2.imencode(".png", image)
    return "data:image/png;base64,"+b64.b64encode(buffer).decode()


def b64_to_numpy_image(b64_string: str) -> np.ndarray:
    """
    Convert a base64 string to a numpy array

    Args:
        b64_string (bytes): The base64 string
    Returns:
        np.ndarray: The numpy array
    """
    return cv2.imdecode(
        np.fromstring(
            b64.b64decode(
                b64_string.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,","")
            ), 
            np.uint8
        ),
        cv2.IMREAD_ANYCOLOR
    )


def generate_args(code: str) -> dict:
    """
    Generate the arguments for the model

    Args:
        code (str): The code to execute
    Returns:
        dict: The arguments
    """
    exec(code,)
    ret = locals()
    ret.pop("code")
    return ret


def download_json(workspace: AbsWorkspace, trainer: AbsTrainer) -> dict:
    """
    Download the model as a json file.

    Args:
        workspace (Workspace): The workspace
    Returns:
        dict: The status of the download
    """
    temp_dir = pathlib.join(workspace.__path__, "outputs")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)

    with open(pathlib.join(workspace.__path__, 'outputs', 'model.json'), "w+") as file:
        file.write(trainer.model.to_json())
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_json_w(workspace: AbsWorkspace, trainer: AbsTrainer) -> dict:
    """
    Download the model as a json file with weights.

    Args:
        workspace (Workspace): The workspace
    Returns:
        dict: The status of the download
    """
    temp_dir = pathlib.join(workspace.__path__, "outputs")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)

    temp_dir = pathlib.join(workspace.__path__, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)

    with open(pathlib.join(temp_dir, 'model.json'), "w+") as file:
        file.write(trainer.model.to_json())
    trainer.model.save_weights(pathlib.join(temp_dir, 'model'))
    chdir(pathlib.join(workspace.__path__, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
    return {
        "message": "Downloading Model",
        "status": True
    }


def download_pb(workspace: AbsWorkspace, trainer: AbsTrainer) -> dict:
    """
    Download the model as a pb file.

    Args:
        workspace (Workspace): The workspace
    Returns:
        dict: The status of the download
    """
    temp_dir = pathlib.join(workspace.__path__, "outputs")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)

    temp_dir = pathlib.join(workspace.__path__, "outputs", "model")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    trainer.model.save(temp_dir)
    chdir(pathlib.join(workspace.__path__, "outputs",))
    with zipfile.ZipFile('model.zip', 'w') as zfile:
        for f in glob("./model/*"):
            zfile.write(f)
        for f in glob("./assets/*"):
            zfile.write(f)
        for f in glob("./variables/*"):
            zfile.write(f)

    return {
        "message": "Downloading Model",
        "status": True
    }


def download_hdf5(workspace: AbsWorkspace, trainer: AbsTrainer) -> dict:
    """
    Download the model as a hdf5 file.

    Args:
        workspace (Workspace): The workspace
    Returns:
        dict: The status of the download
    """
    temp_dir = pathlib.join(workspace.__path__, "outputs")
    if pathlib.isdir(temp_dir):
        rmtree(temp_dir)
    mkdir(temp_dir)
    temp_dir = pathlib.join(workspace.__path__, "outputs", "model.hdf5")
    trainer.model.save(temp_dir)
    return {
        "message": "Downloading Model",
        "status": True
    }

def embed_root(html_string: str) -> str:
    """
    Embed the root of the workspace in the html string.
    """
    root_string = "`http://${window.HOST}:${window.PORT}`"
    replace_string = "''"
    html_string = html_string.replace(root_string, replace_string)
    
    wssr_string = "`ws://${window.HOST}:${window.PORT}`"
    replace_string = "`ws://${window.location.host}`"
    html_string = html_string.replace(wssr_string, replace_string)
    
    return html_string

download_options = {
    "json": download_json,
    "json_w": download_json_w,
    "pb": download_pb,
    "hdf5": download_hdf5
}
