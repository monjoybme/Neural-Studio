FROM python:3.6

WORKDIR /home/

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

RUN pip install neural_studio==0.0.5

CMD [ "neural-studio", "-port", "8080", -"host", "0.0.0.0", "-dir", "/home", "--no-browser" ]




