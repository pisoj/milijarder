FROM python:latest

COPY src /app
RUN pip3 install flask uwsgi
RUN chown -R $USER:$USER /app
WORKDIR /app
