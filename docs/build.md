# Build

## Main tech stack

* Spring Boot 2
* React 16
* SQLite 3

## Prerequisite

* Node.js
* Maven
* SQLite 3 CLI
* JDK 1.8+

## Building

1. Clone or download the [repository](https://github.com/shzlw/poleo).
2. Install the npm packages only the first time.

```bash
cd web-app
npm install
```

3. Run the build script.

```
# Windows
build.bat

# Linux
./build.sh
```

4. The java executable poleo-x.y.z.jar is generated under the target folder. Run this to start the server.

```
java -jar target\poleo-x.y.z.jar
```

## Source code structure

```
|-- Repository
    |-- config
        |-- poleo.properties
    |-- db
        |-- schema-sqlite.sql
    |-- src
    |-- web-app
    |-- pom.xml
    |-- build.sh
    |-- build.bat
    |...
```

* Src folder contains the java source code.
* Web-app folder contains the react code.
* Schema-sqlite.sql contains the database schema for SQLite 3. The poleo.db file in the release is loaded from this schema.
* The build scripts build the code in web-app first, copy the generated files to src ~/static folder and finally run maven to build the java project.

