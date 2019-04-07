
select * from user {{where name IN (:name)}}
select * from user {{where name = :name}}