# Report Component

## Style customization

* Title
* Position (x, y, width, height, z Index)

  Components can be repositioned and resized on the report. If you'd like to stack/overlap components, z index field can be used to control the stacking order.

* Border
* Content background color 

> After modifying the style, don't forget to click the save button to save the changes.

## Types

Poli supports three types of components.

* Static
  * Text
  * Image
  * Iframe

* Chart
  * Table
  * Pie
  * Bar
  * Line
  * Area

* Filter
  * Slicer

  > Slicer should always return a list of values in the query.
  
  * Single value

## Dynamic SQL query with parameters

To use this feature, you would need to create at least one filter and one chart component. Here is how it works.

1. Create a filter and define a query parameter. The query parameter serves as a placeholder for a real value in the query string. 
2. Create a chart and use the query parameter from the fitler in the SQL query.
3. Enter/Select the value in the filter and click apply filter button to see the chart data change accordingly.

For example:

Create a Slicer filter and define username as query parameter.
```sql
-- Slicer
SELECT username FROM user GROUP BY username;
```

Create a Table chart and use the :username in the IN clause.
```sql
-- Table
SELECT * FROM user WHERE 1 = 1 {{ AND username IN (:username) }}
```

More dynamic query examples:

```sql
-- Query parameter from Slicer
SELECT * FROM user WHERE 1 = 1 {{ AND name IN (:name) }}

-- Query parameter from Single value
SELECT * FROM user WHERE 1 = 1 {{ AND name = :name }}

-- More
SELECT * 
FROM user 
WHERE 1 = 1 
{{ AND department IN (:department) }}
{{ AND role = :role }}
{{ AND created <= :created }}
ORDER BY last_login DESC
```

Nested parameters are not supported. For example:

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

## Drill through

Navigate from one widget to another Report with a query parameter being passed along.

![drillthrough1](_images/screenshots/drillthrough1.jpg)

![drillthrough2](_images/screenshots/drillthrough2.jpg)

![drillthrough3](_images/screenshots/drillthrough3.jpg)

![drillthrough4](_images/screenshots/drillthrough4.jpg)


> If this component has drill through defined, there will be a --> icon on the title bar.


## Permissions

Reports can be edited by Admin/Developer users, associated with a Group and viewed by all users. Check [User Management](/user-management) for more details.
