# Report

Reports are built with components in Poli that provide insights from the data through self-defined filtering options and visual representations. 

## Style customization


* Title
* Height
* Width
  
  > Fixed width vs full width: full width scales the components based on the screen width.
* Background color

![style1](_images/screenshots/style1.jpg)

## Auto refresh

Click the auto refresh button to enable report auto refresh. 

> The refresh rate is in seconds.

![autorefresh](_images/screenshots/autorefresh.jpg)

## Full screen

1. Click the full screen button.

![fullscreen1](_images/screenshots/fullscreen1.jpg)

2. The Report will be opened in a new browser tab in the full screen mode.

![fullscreen2](_images/screenshots/fullscreen2.jpg)

## Embedded

This mode allows the Report to be embedded into another application. The report data can be dynamically changed if dynamic queries are used to build the chart components. The query parameter can be passed by url search parameters. 

![apikey2](_images/screenshots/apikey2.jpg)

For example:
```html
<iframe src="http://localhost:6688/poli/workspace/report/fullscreen?$toReport=SalesReport$apiKey=ap_12345678&$showControl=true&year=2019"></iframe>
```

There are four url search parameters in this example.
    
* $toReport=SalesReport 

  Required. SalesReport is the report name.

* $apiKey=123

  Required. 123 is the api key. The api key can be obtained from the account page.

  ![apikey](_images/screenshots/apikey.jpg)

* year=2019

  Optional. Year is the query parameter. 2019 is the value. Any components that use :year parameter in the query will become reactive.

  For example:
  ```sql
  SELECT * FROM sales_transaction WHERE year = :year
  ```

* $showControl=true

  Optional. Whether to display the title bar with control panel.

## Canned report

Canned report captures a snapshot of the report, which perserves the current status of the filters and charts.

### Why canned report?

If a table chart contains a million records, all those records will be saved in the database which occupies a lot of space.
Keep the canned report small and efficient.

Filters are not allowed to change values in canned report.
Users in Viewer role can only create/view/delete canned report created by themselves.
Users in Developer and Admin role can create/delete canned reports.

For instance, a report has two filters: start date and end date. Select 2019-01-01 and 2019-01-02 to save the data 
Even if the original data is purged from the source database, the snapshot is still persisted in Poli's database which can be used for historical data analysis.
