const mongoose = require('mongoose');

require("dotenv").config();

const dbConnection = () => {
    mongoose.connect(process.env.DB_URL,{

    })
    .then(()=>{
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log(`Error connecting to database: ${error}`);
        process.exit(1);
    })

}

module.exports = dbConnection;