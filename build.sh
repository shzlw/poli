rm -rf server/src/main/resource/static/*
cd web
npm run build
cp -r dist/* ../server/src/main/resources/static/
cd ../server
mvn clean install