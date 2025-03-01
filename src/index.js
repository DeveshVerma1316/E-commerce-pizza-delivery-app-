const express = require('express');
const ServerConfig = require('./config/serverConfig');
const connectDB = require('./config/dbConfig');


const PORT = 3000;

const app = express();
app.listen(ServerConfig.PORT, async()=>{
    await connectDB();
    console.log(`Server started at port ${ServerConfig.PORT}..!!`);
})
   