
# Installation

## Windows/Linux

1. Download the release zip file via the github [release page](https://github.com/shzlw/poli/releases).
2. Unzip it. The folder structure should look like this:

    ```
    |-- Release
        |-- config
            |-- poli.properties
        |-- db
            |-- poli.db
        |-- jdbc-drivers
        |-- poli-x.y.z.jar
        |-- start.sh
        |-- start.bat
        |...
    ```

3. Modify the poli.properties file.

    Poli.db is the SQLite database used by the application. It is pre-loaded with database schema and ready to use.

    > Use absolute path to point to the poli.db file.

    For example:
    ```
    # Windows
    spring.datasource.url= jdbc:sqlite:c:/poli-release/db/poli.db

    or

    # Linux
    spring.datasource.url= jdbc:sqlite:/home/user/poli-release/db/poli.db
    ```

4. Add JDBC drivers.

    > There are no JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and put those JDBC jar files under /jdbc-drivers. 

    For example:
    ```
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

6. Open http://localhost:6688/poli/login in chrome.
7. Done. Welcome to Poli!

## Docker

1. Pull and run the Poli image.

    ```bash
    docker run -d -p 6688:6688 --name poli zhonglu/poli:0.7.0
    ```
2. Add JDBC drivers.

    > There are no JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and copy those JDBC jar files to MY_CONTAINER_ID:/app/jdbc-drivers

    For example,

    ```sh
    docker cp postgresql-42.2.5.jar 3afea8d644df:/app/jdbc-drivers
    ```

3. Restart the container and open http://localhost:6688/poli/login in chrome.
4. Done. Welcome to Poli!

