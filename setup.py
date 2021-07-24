import sys
import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="neural-studio",
    version="0.0.2",
    author="Viraj Patel",
    author_email="vptl185@gmail.com",
    description="A small example package",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/monjoybme/Neural-Studio",
    project_urls={
        "Bug Tracker": "https://github.com/monjoybme/Neural-Studio/issues",
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Development Status :: 4 - Beta",
        "Environment :: GPU :: NVIDIA CUDA :: 10.1",
        "Natural Language :: English",
    ],
    package_dir={"": "src"},
    packages=setuptools.find_packages(where="src"),
    python_requires=">=3.6",
    entry_points={
        'console_scripts': ['neural-studio=neural_studio.cli.studio:run_studio'],
    },
    install_requires=[
        "opencv-python",
        "numpy",
        "pandas",
        "tensorflow-gpu",
        "tqdm",
        "scikit-learn",
        "GPUtil",
        "pyrex-core"
        "psutil"
    ],
    package_data={
        "neural_studio": [
            "data/studio/*.html",
            "data/studio/*.ico",
            "data/studio/*.json",
            "data/studio/*.png",
            "data/studio/*.svg",
            "data/studio/*.txt",
            "data/studio/*.xml"
        ],
        "neural_studio.data": [
            "studio/static/*",
            "studio/static/media/*.svg",
            "studio/static/media/*",
            "studio/static/css/*.css",
            "studio/static/css/*",
            "studio/static/js/*.js",
            "studio/static/js/*"
        ]
    }
)
