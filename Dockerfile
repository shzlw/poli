# Build
FROM openjdk:8-jdk-alpine as builder

WORKDIR /app/src
COPY . .

# Install node and npm
RUN apk add --update nodejs nodejs-npm

ENV MAVEN_VERSION 3.5.4
ENV MAVEN_HOME /usr/lib/mvn
ENV PATH $MAVEN_HOME/bin:$PATH

# Install maven
RUN wget http://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz && \
  tar -zxvf apache-maven-$MAVEN_VERSION-bin.tar.gz && \
  rm apache-maven-$MAVEN_VERSION-bin.tar.gz && \
  mv apache-maven-$MAVEN_VERSION /usr/lib/mvn

# Build the jar
RUN ./build.sh

# Deploy
FROM openjdk:8-jre-alpine

WORKDIR /app

COPY --from=builder /app/src/target/poli-0.12.2.jar /app/poli-0.12.2.jar
COPY --from=builder /app/src/db/poli.db /app/db/poli.db
COPY --from=builder /app/src/build_release/start.sh /app/start.sh
COPY --from=builder /app/src/config/poli.docker.properties /app/config/poli.properties

EXPOSE 6688

RUN mkdir /app/jdbc-drivers
RUN chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]
