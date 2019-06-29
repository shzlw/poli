
# Installation

## Windows/Linux

1. Download the release zip file via the github [release page](https://github.com/shzlw/poleo/releases).
2. Unzip it. The folder structure should look like this:

    ```
    |-- poleo-x.y.z
        |-- config
            |-- poleo.properties
        |-- db
            |-- poleo.db
        |-- jdbc-drivers
        |-- poleo-x.y.z.jar
        |-- start.sh
        |-- start.bat
        |...
    ```

3. Modify the poleo.properties file.

    Poleo.db is the SQLite database used by the application. It is pre-loaded with database schema and ready to use.

    > Use absolute path to point to the poleo.db file.

    For example:
    ```
    # Windows
    spring.datasource.url= jdbc:sqlite:c:/poleo-release/db/poleo.db

    or

    # Linux
    spring.datasource.url= jdbc:sqlite:/home/user/poleo-release/db/poleo.db
    ```

4. Add JDBC drivers.

    > There are no JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and put those JDBC jar files under /jdbc-drivers. 

    For example:
    ```
    |-- poleo-x.y.z
        |-- jdbc-drivers
            |-- postgresql-42.2.5.jar
            |-- mysql-connector-java-8.0.12.jar
            |-- mssql-jdbc-7.2.0.jre8.jar
            |...
    ```

5. Run the start script to start the server.

    ```bash
    # Windows
    start.bat

    # Linux
    ./start.sh
    ```

6. Open http://localhost:6688/poleo/login in chrome.
7. Done. Welcome to Poleo!

## Docker

1. Pull and run the Poleo image.

    ```bash
    docker run -d -p 6688:6688 --name poleo zhonglu/poleo:0.8.0
    ```
2. Add JDBC drivers.

    > There are no JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and copy those JDBC jar files to MY_CONTAINER_ID:/app/jdbc-drivers

    For example,

    ```sh
    docker cp postgresql-42.2.5.jar 3afea8d644df:/app/jdbc-drivers
    ```

3. Restart the container and open http://localhost:6688/poleo/login in chrome.
4. Done. Welcome to Poleo!

