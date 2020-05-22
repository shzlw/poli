
# Installation

## Windows/Linux

1. Make sure the Java Runtime 1.8+ (Oracle or OpenJDK) is installed. You can verify that by typing the follwoing command in command-line:
    ```
    java -version
    ```

    If it is already installed, it would show something similar to this:

    ```
    java version "1.8.0_201"
    Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
    Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)
    ```


2. Go to the github [release page](https://github.com/shzlw/poli/releases). Click the poli-x.y.z.zip file under the Assets section to download the lastest release.
3. Unzip the poli-x.y.z.zip to a location.

    Windows. For instance, unzip to C drive. 

    The folder structure should look like this under: C:\poli-x.y.z\

    ```
    config\poli.properties
    db\poli.db
    jdbc-drivers\
    poli-x.y.z.jar
    start.bat
    ...
    ```

    Linux. For instance, unzip to /home/poli. 

    The folder structure should look like this under: /home/poli/poli-x.y.z/

    ```
    config/poli.properties
    db/poli.db
    jdbc-drivers/
    poli-x.y.z.jar
    start.sh
    ...
    ```

4. Modify the poli.properties file.

    Poli.db is the SQLite database used by the application. It is pre-loaded with database schema and ready to use.

    > Use absolute path to point to the poli.db file.

    Windows. For example:
    ```
    spring.datasource.url= jdbc:sqlite:c:/poli-x.y.z/db/poli.db
    ```

    Linux. For example:
    ```
    spring.datasource.url= jdbc:sqlite:/home/poli/poli-x.y.z/db/poli.db
    ```

5. Add JDBC drivers.

    > There are no JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and put those JDBC jar files under jdbc-drivers. 

    For example:
    ```
    |-- poli-x.y.z
        |-- jdbc-drivers
            |-- postgresql-42.2.5.jar
            |-- mysql-connector-java-8.0.12.jar
            |-- mssql-jdbc-7.2.0.jre8.jar
            |...
    ```

6. Run the start script to start the server.

    Windows
    ```
    start.bat
    ```

    Linux
    ```bash
    start.sh
    ```

7. Open http://localhost:6688/poli/login in chrome.
8. Done. Welcome to Poli!

## Docker

1. Pull and run the Poli image.

    ```bash
    docker run -d -p 6688:6688 --name poli zhonglu/poli:0.12.2
    ```
2. Add JDBC drivers.

    > There are no JDBC drivers included except the JDBC driver for SQLite. You need to download the JDBC jar files based on the database you'd like to connect to and copy those JDBC jar files to MY_CONTAINER_ID:/app/jdbc-drivers

    For example,

    ```sh
    docker cp postgresql-42.2.5.jar poli:/app/jdbc-drivers
    ```

3. Restart the container
    ```sh
    docker restart poli
    ```

4. Open http://localhost:6688/poli/login in chrome. Welcome to Poli!

