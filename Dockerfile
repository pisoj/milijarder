FROM python:latest

COPY src /app
RUN apt-get install python3.10-dev
RUN pip install flask uwsgi
RUN chown -R $USER:$USER /app
WORKDIR /app
