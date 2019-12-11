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
<iframe src="http://localhost:6688/poli/workspace/report/fullscreen?$toReport=SalesReport&$apiKey=ap_12345678&$showControl=true&year=2019"></iframe>
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

The main push to use canned report is that the data in the source database might keep changing or be purged at some point. Sometimes if we need to save a copy of the data before it goes away, that's when canned report comes into play.

Save the report as canned report.

![canned report](_images/screenshots/canned_report.jpg)

Notes
* Filters are not allowed to change values in canned report.
* Users can only create/view/delete canned report created by themselves.

## Share

The report can be shared through a link to public recipients who don't have access to Poli. 

Click the share button. 

![share button](_images/screenshots/share_button.jpg)

Select the expiration date and press generate button. A shared report URL with a unique shared key will be generated.

![share dialog](_images/screenshots/share_dialog.jpg)

The shared report history can be viewed and managed under the event menu.

![share event](_images/screenshots/share_event.jpg)

## Favourite

Favourite list provides a quick access to the reports that are marked as favourite. Toggling the favourite button(heart) can add/remove report to/rom the favourite list.

![favourite](_images/screenshots/favourite.jpg)

## Export to PDF

The report can be exported to a PDF file. The PDF export server is optional and available under export-server folder. Nodejs is required to start it.

  ```sh
  cd export-server
  npm install
  
  -- Start the server
  node poli-export-server.js
  ```

A new config value needs to be added in the poli.properties.

  ```
  poli.export-server-url=http://127.0.0.1:6689/pdf
  ```
Open the report. Click the export to pdf button.

![export_to_pdf_button](_images/screenshots/export_to_pdf_button.jpg)

Rename the PDF file abd hit export button. A PDF file should be downloaded. If the export server is not up, an empty PDF file might be generated.

![export_to_pdf_dialog](_images/screenshots/export_to_pdf_dialog.jpg)

## Access permissions

Reports can be edited by Admin/Developer users, associated with a Group and viewed by all users. Check [User Management](user-management) for more details.

