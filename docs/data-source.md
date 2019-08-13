# Data Source

Poli connects to database through the JDBC interface. You can try connect to any databases that supports JDBC drivers. To configure Poli to connect to different databases, two steps are required.

## Download the JDBC jar file 

Download the JDBC jar files based on the database you'd like to connect to and put those JDBC jar files under /jdbc-drivers. 

For example:
```sh
    |-- jdbc-drivers
        |-- postgresql-42.2.5.jar
        |-- mysql-connector-java-8.0.12.jar
        |-- mssql-jdbc-7.2.0.jre8.jar
        |...
```

> There are no JDBC drivers included in the release except the JDBC driver for SQLite.

## Create a Data Source

For instance, information needed to connect to a PostgreSQL database

```
Connection Url: jdbc:postgresql://127.0.0.1:5432/testdb
Driver Class Name: org.postgresql.Driver
Username: postgres
Password: test
Ping: SELECT 1
```

MySQL
```
Connection Url: jdbc:mysql://127.0.0.1:3306/testdb
Driver Class Name: com.mysql.jdbc.Driver
Ping: SELECT 1

-- If use MySQL Connector/J 8.0 or higher
Driver Class Name: com.mysql.cj.jdbc.Driver
```

SQL Server

```
Connection Url: jdbc:sqlserver://127.0.0.1:1433;databaseName=testdb
Driver Class Name: com.microsoft.sqlserver.jdbc.SQLServerDriver
Ping: SELECT 1
```

> Use the ping button to test the connection.