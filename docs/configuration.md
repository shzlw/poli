# Configuration

Application configurations can be adjusted in poli.properties.

## Data source path

Absolute path to access poli.db in your local environment.

```
# Linux
spring.datasource.url=jdbc:sqlite:/home/poli/poli.db

# Windows
spring.datasource.url=jdbc:sqlite:c:/poli/poli.db
```

## Data source pool size

The maximum number of data source pool size.

```
poli.datasource-maximum-pool-size=50
```

## Number of query results

The maximum number of records returned in the JDBC result set. Default value is -1 which returns unlimited rows

```
poli.maximum-query-records=1000
```

## All multiple SQL statements

Allow to run multiple SQL query statements in the query editor. If there are multiple SQL statements, only the last one will return query results.

```
poli.allow-multiple-query-statements=true
```

For example, when query against PostgreSQL, set the search_path in the first statement and query in the second statement.

```sql
set search_path to MY_SCHEMA;
select * from MY_TABLE;
```

## Internationalization (i18n)

Currently Poli supports two languages: English and Chinese. The default language can be switched via changing the poli.properties

```
# English
poli.locale-language=en 

# Chinese
poli.locale-language=zh
```

## Steps to add your own translations

For instance, add Spanish language: es

1. Use poli/web-app/src/locales/en/translation.json as a base template. Copy the content and create a new file at poli/web-app/src/locales/es/translation.json.

2. Modify the translations in poli/web-app/src/locales/es/translation.json.

3. Modify poli/web-app/src/i18n.js

    ```javascript
    import translationES from './locales/es/translation';

    const resources = {
      es: {
        translation: translationES
      }
    }
    ```

4. Modify poli.properties

    ```
    poli.locale-language=es
    ```

5. Rebuild the project

    Check [Build](build) for more details.




