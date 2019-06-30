# Quick Start
  
## First time login

1. Open http://localhost:6688/poli/login in the browser.

![login](_images/screenshots/login.jpg)

2. Use the default login credentials.

	* username: admin
	* password: adminadmin

![login2](_images/screenshots/login2.jpg)

3. Enter a new password and login again.

![login3](_images/screenshots/login3.jpg)

## Create a datasource

1. Go to Data Source tab. Click new button and enter the data source connection information.

![ds1](_images/screenshots/ds1.jpg)

2. Click save button and use ping button to verify the connection.

![ds2](_images/screenshots/ds2.jpg)

## Create a report

1. Go to Report tab.

![report1](_images/screenshots/report1.jpg)

2. Click new button and enter the report name.

![report2](_images/screenshots/report2.jpg)

3. Click save button. A new empty report is created!

![report3](_images/screenshots/report3.jpg)

## Create a static component

1. Let's add a text box to the report first. Click the edit button to enter report edit mode.

> In report edit mode, the style of report can be modified through changing the attributes in the panel on the left side.

![report4](_images/screenshots/report4.jpg)

2. Click new component button. Select static and text. Enter the text value under config tab.

![report4_1](_images/screenshots/report4_1.jpg)

3. Click save button. A new text box is created!

> The component can be repositioned by dragging the title or be resized by dragging the icon in the bottom right corner.  

![report5](_images/screenshots/report5.jpg)

## Create a chart component

1. Let's add a pie chart to the report. Click new component button. Select chart and pie.

![report6](_images/screenshots/report6.jpg)

2. Choose a data source and enter a query.

> Pie chart requires the query to return at least two columns.

![report7](_images/screenshots/report7.jpg)

3. Go to config tab and select the key vand value for pie chart.

![report8](_images/screenshots/report8.jpg)

4. Click save button. A new pie chart is created!

![report9](_images/screenshots/report9.jpg)

## Create a filter component

1. Let's add a slicer to the report to make it interactive. Click new component button. Select filter and slicer. Choose a data source and enter a query.

> Slicer requires the query to return one column only.

![report10](_images/screenshots/report10.jpg)

2. Go to config tab and assign a value to the query parameter.

![report11](_images/screenshots/report11.jpg)

3. Click save button. A new sclier is created!

![report12](_images/screenshots/report12.jpg)

4. Now it is time to link the slicer and pie chart together. Edit the pie chart query here to include the query parameter.

![report13](_images/screenshots/report13.jpg)

5. Save the report. Select the check box in slicer and click apply filters button. The data in pie chart is being filtered by the slicer!

![report14](_images/screenshots/report14.jpg)

## Create a group

1. Go to User Management -> Group tab. Click new button. Enter a new group name and assign Report 1 to the group.

![group1](_images/screenshots/group1.jpg)

2. Click save button. A new group is created! 

![group2](_images/screenshots/group2.jpg)

## Create a user

1. Go to User tab. Click new button. Enter a new username, assign viewer role and the group created above.

![user1](_images/screenshots/user1.jpg)

2. Click save button. A new user with viewer role is created!

![user2](_images/screenshots/user2.jpg)

## View the report

1. Log in by using viewer 1 credentials.

![user3](_images/screenshots/user3.jpg)

2. The report assigned to the group is being displayed!

![user4](_images/screenshots/user4.jpg)