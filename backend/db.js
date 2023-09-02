import mysql from 'mysql2/promise'; // Import mysql2

import dotenv from 'dotenv';

dotenv.config();

const connectionOptions = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
};

// Create a connection pool with the connection options
export const pool = mysql.createPool(connectionOptions);

// export const db= mysql.createConnection({
//     host:process.env.MYSQLHOST,
//     user: process.env.MYSQLUSER,
//     password:process.env.MYSQLPASSWORD,
//     database: process.env.MYSQLDATABASE,
//     // port: process.env.MYSQLPORT,
// })