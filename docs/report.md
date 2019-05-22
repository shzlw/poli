# Report

## Width

Fixed width vs Auto width

## Height

Height needs to be defined.

## Style Customization

* Background color

## Auto refresh

Enable auto refresh. The refresh rate is in seconds. This will query and refresh the chart data every X seconds. 

## Drill through

* Navigate from one widget to another dashboard and pass a parameter. The destination dashboard can then 

There will be a FLAG icon on the title bar if this component has drill through defined.

## Full screen

Open the report in full screen mode in a new browser tab.

## Embedded

This mode allows the dashboard to be embedded into another application. The chart data can be dynamically changed if a dynamic query is used. The query parameter can be passed by url search parameters. For example:

```html
<iframe src="http://localhost:6688/poli/workspace/report/full/SalesReport?$apiKey=ap_12345678&$showControl=true&year=2019"></iframe>
```
* Url search parameters
    report name

    Required
        $apiKey=123
    Optional 
        $showControl=true

        show the title bar with control panel.
    Query parameters

    For example,
        year=2019

```sql
SELECT * FROM sales_report WHERE year = :year
```

## Report Component

## Position

Move/resize

## Type

* Static
    Text
    Image
    Iframe
* Chart
    Table
    Pie
    Bar
    Line
* Filter
    Slicer
      a list of values
    Single value
      a single value

    * properties 
        * Parameter: serves as a placeholder for a real value in the query string 
        * Value: is the actual value passed to the query string.

## Dynamic SQL query with parameters

Filter defines the query parameter. Pass it to the charts which uses it in the dynamic sql.

```sql
-- Slicer
SELECT * FROM user WHERE 1 =1 {{ AND name IN (:name) }}

-- Single value
SELECT * FROM user WHERE 1 = 1 {{ AND name = :name }}

-- More
SELECT * 
FROM user 
WHERE 1 = 1 
{{ AND department IN (:department) }}
{{ AND role = :role }}
{{ AND created <= :created }}
```

!> Nested parameters are not supported. For example, 

```sql
-- Invalid
SELECT * 
FROM user 
WHERE 1 = 1 
{{ 
    AND department IN (:department) 
    {{ AND role = :role }}
}}
```