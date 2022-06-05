FROM python:latest

COPY src /app
RUN pip install --upgrade pip
RUN pip install uwsgi
RUN chown -R $USER:$USER /app
WORKDIR /app
