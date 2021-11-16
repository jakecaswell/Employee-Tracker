Create Table department (
    id Integer AUTO_INCREMENT Primary Key,
    department_name Varchar(30)
);

Create Table roles (
    id Integer AUTO_INCREMENT Primary Key,
    title Varchar(30) Not Null, 
    salary Decimal,
    department_id Integer,
    Foreign Key (department_id) References department(id)
);

Create Table employee (
    id Integer AUTO_INCREMENT Primary Key,
    first_name Varchar(30) Not Null,
    last_name Varchar(30) Not Null,
    role_id Integer, 
    manager_id Integer,
    Foreign Key (role_id) References roles(id),
    Foreign Key (manager_id) References employee(id)
);