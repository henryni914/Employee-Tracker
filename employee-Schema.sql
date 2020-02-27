DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE departmentTable (
 id int not null auto_increment,
 department varchar(30),
 primary key (id)
);

CREATE TABLE roleTable (
  id int not null auto_increment,
  title varchar(30),
  salary decimal,
  department_id int,
  primary key (id),
  foreign key (department_id) references departmentTable (id)
);

CREATE TABLE employeeTable (
 id int not null auto_increment,
 first_name varchar(30),
 last_name varchar(30),
 role_id int,
 primary key (id),
 foreign key (role_id) references roleTable (id)
);

select * from departmentTable;
select * from roleTable;
select * from employeeTable;

insert into departmentTable (department)
values ("Sales"), ("Finance"),("Marketing");

insert into roleTable (title, salary, department_id)
values ("Engineer", 80000, 1), ("Manager", 100000, 1), ("Software Developer", 90000, 2), ("Janitor", 45000, 3);

insert into employeeTable (first_name, last_name, role_id)
values ("Henry", "Ni", 1), ("Kenny", "Lam", 2), ("Amy", "Lin", 3), ("Rebecca", "Cheung", 4), ("Jessica", "Cheung", 4);

select departmentTable.department, departmentTable.id, roleTable.title, roleTable.salary, roleTable.department_id, employeeTable.first_name, employeeTable.last_name, employeeTable.role_id
from departmentTable
inner join roleTable on roleTable.department_id = departmentTable.id
inner join employeeTable on roleTable.id = employeeTable.role_id;
