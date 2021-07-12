import sys
import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="neural-studio-code-kage",
    version="0.0.1",
    author="Example Author",
    author_email="author@example.com",
    description="A small example package",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/pypa/sampleproject",
    project_urls={
        "Bug Tracker": "https://github.com/pypa/sampleproject/issues",
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    package_dir={"": "src"},
    packages=setuptools.find_packages(where="src"),
    python_requires=">=3.6",
    scripts=["temp/neural-studio"],
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
