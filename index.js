//import inquirer from "inquirer";
//import pool from "./db/config.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";    

// async function main() {
//     const questions = [ {
//         type: "list",
//         name: "questions",
//         message: "What would you like to do?",
//         choices: [
//         "Add department",
//         "Add role",
//         "Add employee",
//         "View departments",
//         "View roles",
//         "View employees",
//         "Update employee role",
//         "Quit",
//         ],
//     }
//     ];
    
//     const { action } = await inquirer.prompt(questions);

//     switch (action) {
//         case "Add department":
//         await addDepartment();
//         break;
//         case "Add role":
//         await addRole();
//         break;
//         case "Add employee":
//         await addEmployee();
//         break;
//         case "View departments":
//         await viewDepartments();
//         break;
//         case "View roles":
//         await viewRoles();
//         break;
//         case "View employees":
//         await viewEmployees();
//         break;
//         case "Update employee role":
//         await updateEmployeeRole();
//         break;
//         case "Quit":

//         pool.end();
//         process.exit();
//     }
//     }

//     async function addDepartment() {
//     const { departmentName } = await inquirer.prompt({
//         type: "input",
//         name: "departmentName",
//         message: "What is the name of the department?",
//     });
//     }

// main();



import inquirer from "inquirer";
import pool from "./db/config.js";

// Main function
async function main() {
    const questions = [
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View roles",
                "View employees",
                "Update employee role",
                "View employees by manager",
                "Delete department",
                "Delete role",
                "Delete employee",
                "Quit",
            ],
        },
    ];

    const { action } = await inquirer.prompt(questions);

    switch (action) {
        case "Add department":
            await addDepartment();
            break;
        case "Add role":
            await addRole();
            break;
        case "Add employee":
            await addEmployee();
            break;
        case "View departments":
            await viewDepartments();
            break;
        case "View roles":
            await viewRoles();
            break;
        case "View employees":
            await viewEmployees();
            break;
        case "Update employee role":
            await updateEmployeeRole();
            break;
        case "Delete department":
            await deleteDepartment();
            break;
            case "Delete role":
            await deleteRole();
            break;
        case "Delete employee":
            await deleteEmployee();
            break;
        case "Quit":
            pool.end();
            console.log("Goodbye!");
            process.exit();
    }

    // Restart the loop
    await main();
}

// Function to add a department
async function addDepartment() {
    const { departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
    });

    try {
        const result = await pool.query("INSERT INTO department (name) VALUES ($1) RETURNING id;", [departmentName]);
        console.log(`Added ${departmentName} to departments with ID: ${result.rows[0].id}`);
    } catch (err) {
        console.error("Error adding department:", err);
    }
}

// Function to view all departments
async function viewDepartments() {
    try {
        const result = await pool.query("SELECT * FROM department");
        console.table(result.rows);
    } catch (err) {
        console.error("Error retrieving departments:", err);
    }
}

// Function to add a role
async function addRole() {
    const departments = await pool.query("SELECT id as value, name FROM department");

    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the name of the role:",
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary of the role:",
        },
        {
            type: "list",
            name: "department_id",
            message: "Select the department:",
            choices: departments.rows,
        },
    ]);

    try {
        const result = await pool.query(
            "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id",
            [title, salary, department_id]
        );
        console.log(`Added ${title} to roles with ID: ${result.insertId}`);
    } catch (err) {
        console.error("Error adding role:", err);
    }
}
// Function to view all roles
async function viewRoles() {
    try {
        const result = await pool.query("SELECT * FROM role");
        console.table(result.rows);
    } catch (err) {
        console.error("Error retrieving roles:", err);
    }
}
// Function to update an employee's role
async function updateEmployeeRole() {
    try {
        const employeeRows = await pool.query("SELECT id AS value, first_name AS name FROM employee");
        const roleRows = await pool.query("SELECT id AS value, title AS name FROM role");
        console.log(employeeRows);

        if (employeeRows.rows.length === 0) {
            console.log("No employees found. Please add an employee first.");
            return;
        }

        if (roleRows.rows.length === 0) {
            console.log("No roles found. Please add a role first.");
            return;
        }

        const { employee_id, role_id } = await inquirer.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Select the employee to update:",
                choices: employeeRows.rows,
            },
            {
                type: "list",
                name: "role_id",
                message: "Select the new role:",
                choices: roleRows.rows,
            },
        ]);

        const result = await pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", [role_id, employee_id]);
        console.log(result);
        if (result.rowCount > 0) {
            console.log(`Updated role for employee with ID: ${employee_id}`);
        } else {
            console.log(`Employee with ID: ${employee_id} not found.`);
        }
    } catch (err) {
        console.error("Error updating employee role:", err);
    }
}
// Function to add an employee
async function addEmployee() {
    const roles = await pool.query("SELECT id as value, title as name FROM role");
    try {
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "Enter the employee's first name:",
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter the employee's last name:",
            },
            {
                type: "list",
                name: "role_id",
                message: "Select the employee's role:",
                choices: roles.rows,
            },
            {
                type: "input",
                name: "manager_id",
                message: "Enter the employee's manager ID (if applicable):",
            },
        ]);

        // Ensure all fields have valid values before executing the query
        const values = [first_name, last_name, role_id, manager_id || null];

        // Correct SQL query
        const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const result = await pool.query(query, values);
        console.log("✅ Employee added:", result.rows[0]);
    } catch (err) {
        console.error("❌ Error adding employee:", err);
    }
}
// Function to view employees
async function viewEmployees() {
    try {
        const { rows } = await pool.query(`
            SELECT 
                e.id, 
                e.first_name, 
                e.last_name, 
                r.title AS role, 
                d.name AS department, 
                r.salary, 
                COALESCE(CONCAT(m.first_name, ' ', m.last_name), 'No Manager') AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY e.id DESC;  -- Fetch latest employees first
        `);

        console.table(rows); // Display latest employees
    } catch (err) {
        console.error("Error retrieving employees:", err);
    }
}

// Function to delete a department
async function deleteDepartment() {
    try {
        const result = await pool.query("SELECT id as value, name as name FROM department");
        const departments = result.rows;
        console.log("Departments:", departments);

        if (departments.length === 0) {
            console.log("No departments found. Please add a department first.");
            return;
        }
        // Prompt user to select a department to delete
        const { department_id } = await inquirer.prompt([
            {
                type: "list",
                name: "department_id",
                message: "Select the department you want to delete:",
                choices: departments,
                },
        ]);

        // Check if there are any roles assigned to this department
        const roleCheck = await pool.query("SELECT 1 FROM role WHERE department_id = $1", [department_id]);

        if (roleCheck.rowCount > 0) {
            console.log("❌ Cannot delete department: It has roles assigned. Please delete those roles first.");
            return;
        }

        // Safe to delete the department
        const deleteResult = await pool.query("DELETE FROM department WHERE id = $1", [department_id]);

        if (deleteResult.rowCount > 0) {
            console.log(`✅ Successfully deleted department with ID: ${department_id}`);
        } else {
            console.log("❌ Department not found or already deleted.");
        }

    } catch (err) {
        console.error("Error deleting department:", err);
    }
}

// Function to delete a role
async function deleteRole() {
    try {
        const { rows: roles } = await pool.query("SELECT id as value, title as name FROM role");
        console.log("Roles:", roles);

        if (roles.length === 0) {
            console.log("No roles found. Please add a role first.");
            return;
        }

        // Prompt user to select a role to delete
        const { role_id } = await inquirer.prompt([
            {
                type: "list",
                name: "role_id",
                message: "Select the role you want to delete:",
                choices: roles.map(role => ({
                    value: role.value,
                    name: role.name,
                })),
            },
        ]);

        // Check if the role exists
        const checkRole = await pool.query("SELECT * FROM role WHERE id = $1", [role_id]);
        if (checkRole.rowCount === 0) {
            console.log(`Role with ID: ${role_id} does not exist.`);
            return;
        }

        // Check if the role is associated with any employees
        const employeeCount = await pool.query("SELECT COUNT(*) FROM employee WHERE role_id = $1", [role_id]);
        if (employeeCount.rows[0].count > 0) {
            console.log(`Cannot delete role with ID: ${role_id} because it has associated employees.`);
            return;
        }

        // Delete the role
        const result = await pool.query("DELETE FROM role WHERE id = $1", [role_id]);
        if (result.rowCount > 0) {
            console.log(`Deleted role with ID: ${role_id}`);
        } else {
            console.log(`Role with ID: ${role_id} not found.`);
        }
    } catch (err) {
        console.error("Error deleting role:", err);
    }
}
// Function to delete an employee
async function deleteEmployee() {
    try {
        const { rows: employees } = await pool.query("SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee");
        console.log("Employees:", employees);

        if (employees.length === 0) {
            console.log("No employees found. Please add an employee first.");
            return;
        }

        // Prompt user to select an employee to delete
        const { employee_id } = await inquirer.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Select the employee you want to delete:",
                choices: employees.map(employee => ({
                    value: employee.value,
                    name: employee.name,
                })),
            },
        ]);

        // Check if the employee exists
        const checkEmployee = await pool.query("SELECT * FROM employee WHERE id = $1", [employee_id]);
        if (checkEmployee.rowCount === 0) {
            console.log(`Employee with ID: ${employee_id} does not exist.`);
            return;
        }

        // Delete the employee
        const result = await pool.query("DELETE FROM employee WHERE id = $1", [employee_id]);
        if (result.rowCount > 0) {
            console.log(`Deleted employee with ID: ${employee_id}`);
        } else {
            console.log(`Employee with ID: ${employee_id} not found.`);
        }
    }
    catch (err) {
        console.error("Error deleting employee:", err);
    }
}

// Start the application
main();