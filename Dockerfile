FROM python:latest

COPY src /app
RUN apt-get update -y
RUN apt-get install python-dev -y
RUN pip install flask uwsgi
RUN chown -R $USER:$USER /app
WORKDIR /app
