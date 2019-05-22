# User Management

## System Role

Admin
* Manage dashboards
* Manage datasources
* Manage users

Developer
* Manage dashboards
* Manage datasources
* Manage only viewer role users

Viewer
* Have access to dashboards

## Group
Group is used to control the access level to dashboards for Viewer user. Dashboards can be assigned to Group so the users who belong to that group will have access.

For example
* User u1 belongs to Group g1
* User u2 belongs to Group g2
* Dashboard d1 is assigned to Group g1
* Dashboard d1, d2 and d3 are assigned to Group g2
* User u1 has access to Dashboard d1 only
* user u2 has access to Dasbhoard d1, d2 and d3