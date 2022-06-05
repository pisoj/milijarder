FROM python:latest

COPY src /app
RUN apt-get update -y
RUN apt-get install python3.10-dev -y
RUN pip install flask uwsgi
RUN chown -R $USER:$USER /app
WORKDIR /app
