Employee Tracker

# Description

This command-line application allows business owners to efficiently manage their company's employee database. Built using Node.js, Inquirer, and PostgreSQL, it enables users to perform CRUD operations on departments, roles, and employees.

# Table of Contents

- Installation

- Usage

- Features

- Schema

- Bonus Features

- Walkthrough Video

- License

# Installation

1. Clone the repository:

git clone <repository-url>
cd employee-tracker

2. Install dependencies:

npm install

3. Set up the PostgreSQL database:

Create a PostgreSQL database.

Run the provided schema.sql file to create tables.

Optionally, run seeds.sql to populate sample data.

psql -U <your-username> -d <your-database-name> -f schema.sql
psql -U <your-username> -d <your-database-name> -f seeds.sql

4. Create a .env file with your database credentials:

DB_HOST=localhost
DB_USER=<your-username>
DB_PASSWORD=<your-password>
DB_NAME=<your-database-name>

# Usage

1. Start the application:

npm start

2. Use the interactive menu to perform actions such as:

View all departments, roles, and employees.

Add a new department, role, or employee.

Update an employee's role.

# Features

 - User Story

AS a business owner, I Want to be able to view and manage the departments, roles, and employees in my company
so that I can organize and plan my business.

 - Acceptance Criteria

View all departments, roles, and employees in a formatted table.

Add a department, role, or employee by providing necessary details.

Update an employee's role using an interactive prompt.

Ensure data integrity with proper foreign key relationships.

 - Schema

The database consists of three tables:

1. Department

2. Role

3. Employee

# Link

Github repo link!

# Walkthrough Video

Click here to watch the walkthrough video - https://app.screencastify.com/v3/watch/hJPdwR5z5R7rPkHVKy6b

# License

This project is licensed under the MIT License.

