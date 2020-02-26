DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE employeeTable (
 id int not null auto_increment,
 first_name varchar(30),
 last_name varchar(30),
 role_id int,
 manager_id int,
 primary key (id)
);

CREATE TABLE roleTable (
  id int not null auto_increment,
  title varchar(30),
  salary decimal,
  department_id int
);



CREATE TABLE managerTable (
 id int not null auto_increment,
 name varchar(30)
);

select * from employeeTable;
select * from roleTable;
select * from managerTable;
