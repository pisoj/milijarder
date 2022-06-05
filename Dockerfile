FROM python:latest

COPY src /app
RUN pip install flask gunicorn
RUN chown -R $USER:$USER /app
WORKDIR /app
