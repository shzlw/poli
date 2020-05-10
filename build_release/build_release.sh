VERSION=$(./version)
if [ $# -eq 0 ]; then
  echo "No arguments specified. Use default version: $VERSION"
else
  VERSION=$1
  echo "Version entered: $VERSION"
fi

release=poli-$VERSION
mkdir $release

rm -rf src/main/resources/static
cd web-app
npm install
npm run build
mkdir ../src/main/resources/static
cp -r build/* ../src/main/resources/static/
cd ..
mvn clean package -DskipTests

cp -r export-server $release
cp target/poli-*.jar $release
cp -r docs $release
cp LICENSE $release
cp -r third-party-license $release
cp build_release/start.sh $release
cp build_release/start.bat $release
chmod 755 $release/start.sh
chmod 755 $release/start.bat
cp README.md $release
cp -r upgrade $release
mkdir $release/jdbc-drivers
mkdir $release/config
cp config/poli.properties $release/config/poli.properties
mkdir $release/db
cd $release/db
sqlite3 poli.db < ../../db/schema-sqlite.sql
chmod 755 poli.db
cd ../..
mv $release release

cd release
zip -r $release.zip $release/






