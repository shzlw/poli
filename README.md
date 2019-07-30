# **Poli**

[![Version](https://img.shields.io/badge/Version-0.9.1-0065FF.svg)](#)
[![license: MIT](https://img.shields.io/badge/license-MIT-FF5630.svg)](https://opensource.org/licenses/MIT)
[![Download](https://img.shields.io/github/downloads/shzlw/poli/total.svg?color=6554C0)](https://github.com/shzlw/poli/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/zhonglu/poli.svg)](https://cloud.docker.com/u/zhonglu/repository/docker/zhonglu/poli)
[![Build Status](https://travis-ci.org/shzlw/poli.svg?branch=master)](https://travis-ci.org/shzlw/poli)
[![codecov](https://codecov.io/gh/shzlw/poli/branch/master/graph/badge.svg)](https://codecov.io/gh/shzlw/poli)

Poli is an easy-to-use SQL reporting application built for SQL lovers!

## Why Poli

#### :zap: Self-hosted & easy setup
Platform independent web application. Single JAR file + Single SQLite DB file. Get up and running in 5 minutes.
#### :muscle: Connect to any database supporting JDBC drivers
PostgreSQL, Oracle, SQL Server, MySQL, Elasticsearch... You name it.
#### :bulb: SQL editor & schema viewer
No ETLs, no generated SQL, polish your own SQL query to transform data.
#### :fire: Rich and flexible styling
Pixel-perfect positioning + Drag'n'Drop support to customize the reports and charts in your own way.
#### :bookmark_tabs: Interactive Adhoc report
Utilize the power of dynamic SQL with query variables to connect Filters and Charts.
#### :hourglass: Canned report
Capture the snapshot of historical data. Free up space in your own database.
#### :santa: User management
Three system level role configurations + Group based report access control.
#### :earth_americas: Internationalization
Custom the language pack and translations just for your audience.
#### :moneybag: MIT license
Open and free for all usages.
#### :gem: Is that all?
Auto refresh, drill through, fullscreen, embeds, color themes + more features in development.

## What's New ([latest](https://shzlw.github.io/poli/#/change-logs))


![poli v0.8.0](http://66.228.42.235:8080/image-0.8.0/bob_glass_en.jpg)

## Gallery

#### Slicer & Charts

![poli v0.5.0](http://66.228.42.235:8080/slicer.gif)

#### Move & Resize

![poli component reposition](http://66.228.42.235:8080/move.gif)

#### Color palette switch & export CSV

![poli v0.6.0](http://66.228.42.235:8080/v0.6.0_new.gif)

## Quick Installation

Windows/Linux

```sh
java -jar poli-0.9.1.jar
```

Docker

```sh
docker run -d -p 6688:6688 --name poli zhonglu/poli:0.9.1
```

Check [installation guide](https://shzlw.github.io/poli/#/installation) for more details.

## Download

[Download](https://github.com/shzlw/poli/releases) the latest version of Poli via the github release page.

## Documentation

Poli's documentation and other information can be found at [here](https://shzlw.github.io/poli/).

## License

MIT License

Copyright (c) 2019 Zhonglu Wang