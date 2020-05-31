# Change Logs

## v0.12.2

### Bug Fixes
- Add default value option for multi series charts (bar, line and area).
- Fix the issue that table column is not sorted correctly if the data type is number.
- Fix the query editor input lagging.

## v0.12.1

### Bug Fixes
- Fix the issue that bar, line and area chart display wrong data when multi series option is checked in the chart option.

## v0.12.0

### Upgrade Steps
- New databse tables need to be loaded in order to support saved query and audit log. 

  ```sh
  ./sqlite3 poli.db

  -- File is located at upgrade/poli_upgrade_v0.12.0.sql
  sqlite> .read poli_upgrade_v0.12.0.sql
  ```

### Improvements
- Upgrade spring boot version and npm packages.
- Add fixed header option for table component.
- Update app style so new look & feel.
- Update app icon.
- Add french translation provided by @pasqal. Thanks! 
- Update installation guide.
- Add new kanban component.
- Add new studio page to save used Query and turn SQL Query into a HTTP endpoint.
- Add new audit log page.

## v0.11.0

### New Features
- Support export report to PDF. 
  ```sh
  -- The export server is optional and placed under export-server folder. 
  -- New configuration value needs to be specified in the poli.properties:
  -- poli.export-server-url=http://127.0.0.1:6689/pdf
  -- Start the export server.
  node poli-export-server.js
  ```
- Add new Spanish translation #41.

### Improvements
- Improve the build scripts and Dockerfile.
- Add "Run on Google Cloud" button.
- Add a more options button to group buttons on report page.

### Bug Fixes
- Fix the issue that the query returns column name instead of column alias.

## v0.10.1

### Improvements
- Set default JDBC fetch size to 100.

### Bug Fixes
- Fix multiple issues that affect shared report to work properly.

## v0.10.0

### Breaking Changes & Upgrade Steps
  ```sh
  -- Backup your database before you make changes to it
  ./sqlite3 poli.db

  -- File is located at upgrade/poli_upgrade_v0.10.0.sql
  sqlite> .read poli_upgrade_v0.10.0.sql
  ```

  Check upgrade for more details.

### New Features
- A shared report URL can be generated with an expiration date defined through the share button. The shared report history can be viewed and managed under the event menu.
- Reports can be grouped into projects which are collapsible on the side report menu.
- Reports can be marked as farourite for quick access through the favourite button.
- Allow to set default parameter value for filter component.
- For Line/Bar/Area charts, the margin of the chart grid can be adjusted.

### Improvements
- Using $apiKey in the URL doesn't allow access to the report page but only the full screen page. The full screen report can still be embedded into another application and the report name and other parameters can be changed on the fly.
- UI is refined to provide a cleaner user experience.
- Add samples in docuemnt on how to setup data source for MySQL and SQL Server.
- Add new upgrade steps for windows/linux.


### Bug Fixes
- Fix an issue that the full screen page doesn't display locale language.
- Fix an issue that the search input on report page doesn't display correctly if the scroll bar shows.

## v0.9.1

### Improvements
- Now press shift + arrow key to move component instead of pressing arrow key only.
- Add a pop up that allows renaming the CSV file before it is exported.
- Support multiple SQL statements in the query editor. Add a new global configuration value to enable/disable this feature. (poli.allow-multiple-query-statements)
- Set default maximum-query-records to unlimited.
- Add new script to build the release folder.

### Bug Fixes
- Fix an issue that heatmap displays wrong max and min value.
- Fix the wrong column types in schema-postgresql.sql.
- Fix the exception thrown from GeneratedKeyHolder when using PostgreSQL as data store.
- Fix an issue when hover over the CSV button in a titleless table, the cursor flips between pointer and resizer.
- Fix an issue that the URL parameters are not used in the query when the report is initialized.
- Fix an issue that accessing the full screen view will direct the user to the login page when remember me is not checked.

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

### Bug Fixes
- Fix an issue that the report group modification doesn't update the user report cache.
- Fix an issue that the user with viewer role cannot save canned report.

## v0.8.1

### Bug Fixes
- Fix an issue that the sub type selection doesn't work after the i18n is changed to another language other than en.
- Fix an issue that the auth filter may throw an NPE.

### Improvements
- Allow Image to display in full scale.
- Add a new flag "Show All Axis Labels" for charts that support axis label to force the chart to display all labels.

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