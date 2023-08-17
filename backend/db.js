import mysql from 'mysql';

export const db= mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"MYSQL123@",
    database: 'science_experiments_blog',
})