const mysql=require("mysql");
const dotenv=require('dotenv');
dotenv.config();

const connDB=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:process.env.database_pass,
    database:'university',
    port:3306
});

module.exports=connDB;