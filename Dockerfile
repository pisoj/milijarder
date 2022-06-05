FROM python:latest

COPY src app
RUN pip install flask gunicorn
WORKDIR app
