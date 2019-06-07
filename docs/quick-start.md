# Quick Start
  
## First time login

Open  http://localhost:6688/poli/login in chrome.

![login](_images/screenshots/login.jpg)

Use the default login credentials.

* username: admin
* password: adminadmin

![login2](_images/screenshots/login2.jpg)

Enter a new password and login again.

![login3](_images/screenshots/login3.jpg)

## Create a datasource

Enter the data source connection information.

![ds1](_images/screenshots/ds1.jpg)

Click ping button to test the connection.

![ds2](_images/screenshots/ds2.jpg)

## Create a report

Click report tab and be ready to create the first report!

![report1](_images/screenshots/report1.jpg)

Enter the report name.

![report2](_images/screenshots/report2.jpg)

Click save button. A new report is created!

![report3](_images/screenshots/report3.jpg)


create table transaction (
	create_date TIMESTAMP,
	category varchar(100),
	amount NUMERIC(10, 2)
)

## Create a static component

Let's create a text box here. Click the edit button to enter report edit mode.

![report4](_images/screenshots/report4.jpg)

Click new component button. Select static and text. Enter the value under config tab.

![report4_1](_images/screenshots/report4_1.jpg)

Click save button. A new text box is created!

![report5](_images/screenshots/report5.jpg)

## Create a chart component

Let's create a pie chart here. Click new component button. Select chart and pie.

![report6](_images/screenshots/report6.jpg)

Choose a data source and enter a query.

![report7](_images/screenshots/report7.jpg)

Go to config tab and select the key vand value for pie chart.

![report8](_images/screenshots/report8.jpg)

Click save button. A new pie chart is created!

![report9](_images/screenshots/report9.jpg)

## Create a filter component

Let's create a slicer here. Click new component button. Select filter and slicer. Choose a data source and enter a query.

![report10](_images/screenshots/report10.jpg)

Go to config tab and assign a value to the query parameter.

![report11](_images/screenshots/report11.jpg)

Click save button. A new sclier is created!

![report12](_images/screenshots/report12.jpg)

Now it is time to link the slicer and pie chart together. Edit the pie chart query here to include the query parameter.

![report13](_images/screenshots/report13.jpg)

Save the report. Select the check box in slicer and click apply filters button. The data in pie chart is being filtered! 

![report14](_images/screenshots/report14.jpg)

## Create a group

![group1](_images/screenshots/group1.jpg)

![group2](_images/screenshots/group2.jpg)

## Create a user

![user1](_images/screenshots/user2.jpg)

![user2](_images/screenshots/user2.jpg)

## View the report

![user3](_images/screenshots/user3.jpg)

![user4](_images/screenshots/user4.jpg)