FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y \
    git \
    python3 \
    python3-pip \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install uwsgi

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html/ && \
    chmod -R 755 /var/www/html/

EXPOSE 80

CMD ["uwsgi", "--http", "0.0.0.0:80", \
              "--wsgi-file", "/var/www/html/index.py", \
              "--callable", "application", \
              "--static-map", "/static=/var/www/html/static", \
              "--static-map", "/img=/var/www/html/img", \
              "--static-map", "/reto3=/var/www/html/reto3"]

# Comandos a ejecutar:
# docker build -t reto7 .
# docker run -d -p 8080:80 --name ATI-reto7 reto7