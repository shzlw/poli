# Poli

[![Version](https://img.shields.io/badge/Version-0.1.0-0065FF.svg)](#)
[![license: MIT](https://img.shields.io/badge/license-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/shzlw/poli.svg?branch=master)](https://travis-ci.org/shzlw/poli)
[![codecov](https://codecov.io/gh/shzlw/poli/branch/master/graph/badge.svg)](https://codecov.io/gh/shzlw/poli)


## Features

* Connect to any databases supporting JDBC drivers
* Build widgets and filters in SQL
* Dynamic query string
* Drill through 
* Embedded
* Full screen
* Auto refresh

## Get the server running under 60 seconds

#### Prerequisite
* Poli requires JRE 1.8+

Let's start!

1. Download the release zip file.
2. Unzip it. The folder structure should look like this:

```sh
|-- Release
    |-- config
        |-- poli.properties
    |-- db
        |-- poli.db
    |-- poli.jar
    |-- start.sh
    |-- start.bat
    |...
```

3. Run the start script.
```sh
# Windows
start.bat

# Linux
./start.sh
```

4. Open http://localhost:6688/poli/login in chrome
5. Done. Welcome to Poli!

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

## License

MIT License

Copyright (c) 2019 Zhonglu Wang