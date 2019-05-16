# Poli

[![Version](https://img.shields.io/badge/Version-0.1.0-0065FF.svg)](#)
[![license: MIT](https://img.shields.io/badge/license-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/shzlw/poli.svg?branch=master)](https://travis-ci.org/shzlw/poli)
[![codecov](https://codecov.io/gh/shzlw/poli/branch/master/graph/badge.svg)](https://codecov.io/gh/shzlw/poli)

Poli is is an open source, easy-to-use, business intelligence web application.

## Features

* Connect to any databases supporting JDBC drivers
* Build widgets and filters in SQL
* Dynamic SQL query with parameters
* Drill through 
* Embedded
* Full screen
* Auto refresh

## Get the server running under 60 seconds

#### Prerequisite
* Poli requires Java Runtime 1.8+

Let's start!

1. Download the release zip file.
2. Unzip it. The folder structure should look like this:

```sh
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
3. There are not any JDBC drivers included except the JDBC driver for SQLite.
You need to download the JDBC jar files based on the database you want to connect to and put those JDBC jar files under /jdbc-drivers. For example:

```sh
    |-- jdbc-drivers
        |-- postgresql-42.2.5.jar
        |-- mysql-connector-java-8.0.12.jar
        |-- mssql-jdbc-7.2.0.jre8.jar
        |...
```

4. Run the start script.
```sh
# Windows
start.bat

# Linux
./start.sh
```

5. Open http://localhost:6688/poli/login in chrome
6. Done. Welcome to Poli!

** Check the Installation Guide for more details.

## Build

1. Install the npm packages only the first time.
```sh
cd web-app
npm install
```

2. Run the build script.
```sh
# Windows
build.bat

# Linux
./build.sh
```

Main tech stack

* Spring Boot 2
* React 16
* SQLite 3

## Basic Concepts

### Datasource
  JDBC data source

PostgreSQL

    class name: org.postgresql.Driver 
    default: postgres
    url: jdbc:postgresql://localhost/test

Elasticsearch

    org.elasticsearch.xpack.sql.jdbc.EsDriver
    jdbc:es://http://localhost:9200

### Dashboard

Dimension
* Fixed width vs flexible width
* Fixed height
* Full screen
* Embedded mode
    * This mode allows the dashboard to be embedded into another application. The chart data can be dynamically changed if a dynamic query is used. For example:

```html
<iframe src="http://localhost:6688/poli/workspace/dashboard/full/SalesReport?$apiKey=ap_12345678&$showControl=true&year=2019"></iframe>
```
* Url search parameters
* Auto refresh
    * Enable/disble the auto refresh. The refresh rate is in seconds. This will query and refresh the chart data every X seconds.


### Widget

* Chart
    * types
        * Table
        * Pie
* Filter
    * types
        * Slicer
        * Single value
    * properties 
        * Parameter: serves as a placeholder for a real value in the query string 
        * Value: is the actual value passed to the query string.
    

### Dynamic SQL query with parameters

```sql
-- Slicer
SELECT * FROM user WHERE 1 =1 {{ AND name IN (:name) }}

-- Single value
SELECT * FROM user WHERE 1 = 1 {{ AND name = :name }}

-- More
SELECT * 
FROM user 
WHERE 1 = 1 
{{ AND department IN (:department) }}
{{ AND role = :role }}
{{ AND created <= :created }}
```

### Drill through
* Navigate from one widget to another dashboard and pass a parameter

### User Management

### System Role

Admin
* Manage dashboards
* Manage datasources
* Manage users

Developer
* Manage dashboards
* Manage datasources
* Manage only viewer role users

Viewer
* Have access to dashboards

### Group
Group is used to control the access level to dashboards for Viewer user. Dashboards can be assigned to Group so the users who belong to that group will have access.

For example
* User u1 belongs to Group g1
* User u2 belongs to Group g2
* Dashboard d1 is assigned to Group g1
* Dashboard d1, d2 and d3 are assigned to Group g2
* User u1 has access to Dashboard d1 only
* user u2 has access to Dasbhoard d1, d2 and d3
## License

MIT License

Copyright (c) 2019 Zhonglu Wang