FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y \
        apache2 \
        python3 \
        python3-uwsgi \ 
        libapache2-mod-uwsgi \  
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html/ && \
    chmod -R 755 /var/www/html/

EXPOSE 80

CMD ["uwsgi", "--http", "0.0.0.0:80", "--wsgi-file", "/var/www/html/index.py", "--callable", "application"]

# Comandos a ejecutar:
# docker build -t reto7 .
# docker run -d -p 8080:80 --name ATI-reto7 reto7