rm -rf src/main/resources/static
cd web-app
npm install
npm run build
mkdir ../src/main/resources/static
cp -r build/* ../src/main/resources/static/

cd ..
RUN mvn install:install-file -DgroupId=com.ptc -DartifactId=ptc-board-log-client -Dversion=0.0.2-SNAPSHOT -Dpackaging=jar -Dfile=/app/db/ptc-board-log-client-0.0.2-SNAPSHOT.jar  
mvn clean install -DskipTests
