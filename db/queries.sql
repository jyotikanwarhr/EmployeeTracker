SELECT * FROM department ORDER BY id ASC;

SELECT 
    role.id, 
    role.title, 
    department.name AS department,
    role.salary
    
FROM role   
JOIN department ON role.department_id = department.id

SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title,
    role.salary, 
    department.name AS department 
    COALESCE(manager.first_name, ||''||, manager.last_name), 'None' AS employee_manager
FROM employee
left JOIN role ON employee.role_id = role.id
left JOIN department ON role.department_id = department.id
left JOIN employee AS manager ON manager.id = employee.manager_id
ORDER BY employee.id ASC;