
release=poli-$1
mkdir $release

rm -rf src/main/resources/static/*
cd web-app
npm install
npm run build
cp -r build/* ../src/main/resources/static/
cd ..
mvn clean install -DskipTests

cp target/poli-*.jar $release
cp -r docs $release
cp LICENSE $release
cp -r third-party-license $release
cp start.sh $release
cp start.bat $release
cp README.md $release
cp -r upgrade $release
mkdir $release/jdbc-drivers
mkdir $release/config
cp config/poli.properties $release/config/poli.properties
mkdir $release/db
cd $release/db
sqlite3 poli.db < ../../db/schema-sqlite.sql
chmod 755 poli.db







