DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;
CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

-- - **department**:

  -- - **id** - INT PRIMARY KEY
  -- - **name** - VARCHAR(30) to hold department name

-- - **role**:

  -- - **id** - INT PRIMARY KEY
  -- - **title** - VARCHAR(30) to hold role title
  -- - **salary** - DECIMAL to hold role salary
  -- - **department_id** - INT to hold reference to department role belongs to

-- - **employee**:

  -- - **id** - INT PRIMARY KEY
  -- - **first_name** - VARCHAR(30) to hold employee first name
  -- - **last_name** - VARCHAR(30) to hold employee last name
  -- - **role_id** - INT to hold reference to role employee has
  -- - **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager
