const mysql=require('mysql')

const db= mysql.createPool({
    "host":"localhost",
    "user":"root",
    "password":"",
    "database":"courscpe"
});

db.getConnection(()=>{
    console.log('connect to db successfuly');
})

module.exports=db;