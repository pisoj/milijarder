FROM python:latest

COPY src /app
RUN chown -R $USER:$USER /app
WORKDIR /app
