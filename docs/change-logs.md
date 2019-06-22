# Change Logs

## v0.7.0

#### Breaking Changes & Upgrade Steps
- A new databse table needs to be loaded in order to support canned report. 

  ```sh
  ./sqlite3 poli.db

  -- File is in upgrade/poli_upgrade_v0.7.0.sql
  sqlite> .read poli_upgrade_v0.7.0.sql
  ```

#### New Features
- Support [docker installation](https://shzlw.github.io/poli/#/installation?id=Docker).
- A new static component: Html is now available.
- A new filter component: Date picker is now available.
- The report now can be saved as canned report. It captures a snapshot of the report, which perserves the current status of the filters and charts.

#### Bug Fixes
- Fixes an issue that the ping and query logic use different data sources. Now both use HikariDataSource to be consistent.
- Fixes an issue that the query preview returns too many records. Now the number of records returned is limited to a configurable value(poli.maximum-query-records)
- Fixes an issue when a component is selected, both select and drag events are triggered, which can cause the position of the component to shift unintentionally.
Now when the component is first chosen, it will only be selected for editing attributes. If it is selected again, the drag event will be triggered. 

#### Improvements
- More documentation.
- New database schema for PostgreSQL.
- Spring boot is upgraded to 2.1.5 from 2.0.5.
- React is upgraded to 16.8.6 from 16.6.3.
- React-scripts is upgraded to 3.0.1 from 2.1.8.
- Echarts is upgraded to 4.2.1 from 4.1.0.