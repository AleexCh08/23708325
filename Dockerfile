FROM ubuntu:latest

COPY . /var/www/html/

RUN apt-get update && \
    apt-get install -y apache2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN chown -R www-data:www-data /var/www/html/ && \
    chmod -R 755 /var/www/html/

EXPOSE 80

CMD ["apache2ctl", "-D", "FOREGROUND"]

# Comandos a ejecutar:
# docker build -t reto6 .
# docker run -d -p 8080:80 --name ATI-reto6 reto6