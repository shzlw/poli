rm -rf src/main/resources/static
cd web-app
npm install
npm run build
mkdir ../src/main/resources/static
cp -r build/* ../src/main/resources/static/

cd ..
mvn clean package -DskipTests
