FROM openjdk:8-jre-alpine

WORKDIR /app

COPY target/poli-0.7.0.jar /app/poli-0.7.0.jar
COPY db/poli.db /app/db/poli.db
COPY start.sh /app/start.sh
COPY config/poli.docker.properties /app/config/poli.properties

EXPOSE 6688

RUN mkdir /app/jdbc-drivers
RUN chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]