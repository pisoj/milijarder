FROM python:latest

COPY src /app
RUN pip install flask uwsgi
WORKDIR /app
