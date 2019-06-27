FROM openjdk:8-jre-alpine

WORKDIR /app

COPY target/poleo-0.8.0.jar /app/poleo-0.8.0.jar
COPY db/poleo.db /app/db/poleo.db
COPY start.sh /app/start.sh
COPY config/poleo.docker.properties /app/config/poleo.properties

EXPOSE 6688

RUN mkdir /app/jdbc-drivers
RUN chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]