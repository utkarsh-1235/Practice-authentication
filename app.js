const express = require('express');
const app = new express();

const connectToDb = require('./config/db.js');
const router = require('./Router/userRouter.js');
const cookieparser = require('cookie-parser');
const cors = require('cors');


// database connection
connectToDb();

app.use(express.json());  // built in middleware
app.use(cookieparser()) //third party middleware
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }))// third party middleware

 app.use('/api/auth/',router);

app.use('/',(req, res)=>{
   res.status(200).json({data:'JWT auth server'})
})

module.exports = app;