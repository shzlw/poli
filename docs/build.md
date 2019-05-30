# Build

## Building

1. Clone or download the [repository](https://github.com/shzlw/poli).
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

## Source Code Structure

```
|-- Repository
    |-- config
        |-- poli.properties
    |-- db
        |-- poli.db
        |-- schema-sqlite.sql
    |-- src
    |-- web-app
    |-- pom.xml
    |-- build.sh
    |-- build.bat
    |-- start.sh
    |-- start.bat
    |...
```

## Main Tech Stack

* Spring Boot 2
* React 16
* SQLite 3