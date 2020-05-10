rm -rf src/main/resources/static/*
cd web-app
npm run build
cp -r build/* ../src/main/resources/static/
cd ..
mvn clean package -DskipTests
