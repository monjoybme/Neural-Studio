import sys
import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="neural-studio-code-kage",
    version="0.0.5neu",
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
        "Operating System :: Microsoft :: Windows :: Windows 10"
    ],
    package_dir={"": "src"},
    packages=setuptools.find_packages(where="src"),
    python_requires=">=3.6",
    entry_points={
        'console_scripts': ['neural-studio=neural_studio.cli:main'],
    },
    install_requires=[
        "opencv-python",
        "numpy",
        "pandas",
        "tensorflow-gpu",
        "tqdm",
        "scikit-learn"
    ],
    package_data={
        "neural_studio": [
            "data/templates/*.html", 
            "data/templates/*.ico", 
            "data/templates/*.json", 
            "data/templates/*.png", 
            "data/templates/*.svg", 
            "data/templates/*.txt", 
            "data/templates/*.xml"
        ],
        "neural_studio.data":[
            "templates/static/*",
            "templates/static/media/*.svg",
            "templates/static/media/*",
            "templates/static/css/*.css",
            "templates/static/css/*",
            "templates/static/js/*.js",
            "templates/static/js/*"
        ]
    }
)
