# Quick Start
  
## First time login
  Use the default login credentials
    username: admin
    password: adminadmin

  *screenshot

  Enter a new password and login again.

  *screenshot

## Create a datasource
For example, PostgreSQL

    class name: org.postgresql.Driver 
    usename: postgres
    url: jdbc:postgresql://localhost/test

*screenshot

## Create a dashboard

*screenshot

## Create a static widget

Image

*screenshot

## Create a chart widget

Pie

SELECT category, SUM(amount) FROM transaction GROUP BY category;

## Create a filter widget

Slicer

SELECT category FROM transaction GROUP BY category;

## Create a group

Regular

## Create a user



## View the dashboard