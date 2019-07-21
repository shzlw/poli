# Change Logs

## v0.9.0

### Breaking Changes & Upgrade Steps
- A new databse table needs to be loaded in order to support row level security. 

  ```sh
  ./sqlite3 poli.db

  -- File is located at upgrade/poli_upgrade_v0.9.0.sql
  sqlite> .read poli_upgrade_v0.9.0.sql
  ```

### New Features

- User attributes can be defined at per user level and be used in dynamic query to support row level security.
- The selected component can be moved by using arrow key in order to provide more precise control.
- New option to enable/disable auto filtering on report level.
- New option to toggle table pagination.

### Improvements
- When filters are modified, the color of the "apply filters" button will be changed to show indication.
- When the report view is loaded with url parameters from drill through, the filter values will be applied immediately.

## v0.8.1

### Bug Fixes
- Fix an issue that the sub type selection doesn't work after the i18n is changed to another language other than en.
- Fix an issue that the auth filter may throw an NPE.

### Improvements

* Allow Image to display in full scale.
* Add a new flag "Show All Axis Labels" for charts that support axis label to force the chart to display all labels.

## v0.8.0

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

  -- File is located at upgrade/poli_upgrade_v0.7.0.sql
  sqlite> .read poli_upgrade_v0.7.0.sql
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