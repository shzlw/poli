# Change Logs

## v0.8.1

### New Features
- Support [i18n customization](configuration?id=internationalization-i18n). Include default language pack for English and Chinese. 
- Add four new [chart types](report-component?id=chart)
  - Treemap
  - Heatmap
  - Funnel
  - Card

### Bug Fixes
- Fix an issue that sometimes the pagination fails in table chart.

### Improvements
- Documentation for poli.properties.
- Increase the font size range from (1-50) to (1-100) for Text and Card.
- Add overlay for date picker and color picker. Now clicking anywhere on the screen will close the popup dialog.
- Clean up the canned report input field when the dialog is closed.
- Now sharing the report via full screen with api key can only have access to the full screen page.
- The text in the Text (static) is aligned center both vertically and horizontally by default.

## v0.7.0

### Breaking Changes & Upgrade Steps
- A new databse table needs to be loaded in order to support canned report. 

  ```sh
  ./sqlite3 poli.db

  -- File is in upgrade/poleo_upgrade_v0.7.0.sql
  sqlite> .read poleo_upgrade_v0.7.0.sql
  ```

### New Features
- Support [docker installation](https://shzlw.github.io/poli/#/installation?id=docker).
- A new static component: Html is now available.
- A new filter component: Date picker is now available.
- The report now can be saved as canned report. It captures a snapshot of the report, which perseves the current status of the filters and charts.

### Bug Fixes
- Fixes an issue that the ping and query logic use different data sources. Now both use HikariDataSource to be consistent.
- Fixes an issue that the query preview returns too many records. Now the number of records returned is limited to a configurable value(poli.maximum-query-records)
- Fixes an issue when a component is selected, both select and drag events are triggered, which can cause the position of the component to shift unintentionally.
Now when the component is first chosen, it will only be selected for editing attributes. If it is selected again, the drag event will be triggered. 

### Improvements
- More documentation.
- New database schema for PostgreSQL.
- Spring boot is upgraded to 2.1.5 from 2.0.5.
- React is upgraded to 16.8.6 from 16.6.3.
- React-scripts is upgraded to 3.0.1 from 2.1.8.
- Echarts is upgraded to 4.2.1 from 4.1.0.