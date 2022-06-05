FROM python:latest

COPY src /app
RUN pip install flask uwsgi
RUN chown -R /app $USER:$USER
WORKDIR /app
