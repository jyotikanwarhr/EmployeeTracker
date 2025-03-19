import inquirer from "inquirer";
import pool from "./db/config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";    

async function main() {
    const questions = [ {
        type: "list",
        name: "questions",
        message: "What would you like to do?",
        choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee role",
        "Quit",
        ],
    }
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
        case "Quit":

        pool.end();
        process.exit();
    }
    }

    async function addDepartment() {
    const { departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "What is the name of the department?",
    });
    }
console.log(`departmentName: ${departmentName}`);

main();