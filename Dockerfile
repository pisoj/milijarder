FROM python:latest

COPY src /app
RUN pip install flask uwsgi
WORKDIR /app

CMD ["uwsgi", "--http", "0.0.0.0:$PORT", "--module", "app:app"]