FROM python:latest

COPY src /app
RUN pip install --upgrade pip
RUN pip install flask gevent
RUN chown -R $USER:$USER /app
WORKDIR /app
