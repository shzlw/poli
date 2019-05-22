
# Installation Guide

## Prerequisite

  Java Runtime 1.8+

## Installation

1. Download the release zip file.
2. Unzip it. The folder structure should look like this:

```bash
|-- Release
    |-- config
        |-- poli.properties
    |-- db
        |-- poli.db
    |-- jdbc-drivers
    |-- poli.jar
    |-- start.sh
    |-- start.bat
    |...
```

3. Config the property file

Modify poli.properties


4. Add JDBC drivers

!> There are not any JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and put those JDBC jar files under /jdbc-drivers. For example:

```bash
    |-- jdbc-drivers
        |-- postgresql-42.2.5.jar
        |-- mysql-connector-java-8.0.12.jar
        |-- mssql-jdbc-7.2.0.jre8.jar
        |...
```

5. Run the start script.

```bash
# Windows
start.bat

# Linux
./start.sh
```

6. Open http://localhost:6688/poli/login in chrome
7. Done. Welcome to Poli!


