version=$(shell git describe --abbrev=0 --tags | tr -d 'v')
javasrc=$(shell find src)
websrc=$(shell find web-app/public web-app/src) web-app/package.json
webapptarget=src/main/resources/static/index.html

target/poli-$(version).jar: $(javasrc) $(webapptarget)
	mvn clean install -DskipTests

web-app/node_modules: web-app/package.json
	cd web-app && npm install

web-app/build/index.html: $(websrc) web-app/node_modules
	cd web-app && npm run build

$(webapptarget): web-app/build/index.html
	mkdir -p src/main/resources/static/
	rm -rf src/main/resources/static/*
	cp -r web-app/build/* src/main/resources/static/

