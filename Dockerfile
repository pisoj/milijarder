FROM python:latest

COPY src /app
RUN pip install flask uwsgi
RUN chown $USER -R /app
WORKDIR /app
