const mongoose = require('mongoose');
const DbUrl = process.env.DB_URL||"mongodb://localhost:27017/my_database";

const connectToDb = async()=>{
    await mongoose
    .connect(DbUrl)
    .then((conn)=>{console.log(`database connected to${conn.connection.host}`)})
    .catch((err)=>{ console.log("ERROR",err)})

}

module.exports = connectToDb ;

