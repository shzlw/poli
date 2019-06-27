# User Management

## System role

There are three types of system roles in Poleo. Each user account requires to be assigned a system role when the account is created.

#### Admin 

* Only one per instance. Cannot be created.
* Manage reports
* Manage datasources
* Manage users

#### Developer
* Manage reports
* Manage datasources
* Manage users in Viewer Role

#### Viewer
* Access reports

## Group

Group is used to control the access level to reports for Viewer user. Reports can be assigned to Group so the users in Viewer Role who belong to that group can have access.

For example:

```
* User u1 belongs to Group g1
* User u2 belongs to Group g2
* Report r1 is assigned to Group g1
* Report r1, r2 and r3 are assigned to Group g2
* User u1 has access to Report r1 only
* user u2 has access to Report r1, r2 and r3
```