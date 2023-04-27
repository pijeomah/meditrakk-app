const express = require("express")
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const morgan = require('morgan')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const connectDB = require('./config/database')
const pillRoutes = require('./routes/pills')

//Env path in config dir
require("dotenv").config({path: "./config/.env"})


//connect to DB 
connectDB()

//Views Engine 
app.set("view engine", "ejs")

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging dev activity
app.use(morgan('dev'))

//Set up flash messages for errors
// app.use(flash())


//set up the middleware for the routes which the server is listening
app.use("/pills", pillRoutes)



//Setup sessions in MongoDB
app.use(session({
    secret:"secret",
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl:process.env.DB_STRING}
        ),
    })
)

app.listen(process.env.PORT, () =>{
    console.log('Server is running, catch it if you can')
})








































































































































































