FROM python:latest

COPY src /app
RUN pip install flask uwsgi
RUN chown -R $USER:$USER /app
WORKDIR /app
