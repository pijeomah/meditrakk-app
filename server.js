const express = require("express")
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const morgan = require('morgan')
const flash = require('express-flash')
const nodeMailer = require('nodemailer')
const cron = require('node-cron')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const connectDB = require('./config/database')
const pillRoutes = require('./routes/pills')
const mainRoutes = require('./routes/main')
const reminderRoutes = require('./routes/reminder')


//Env path in config dir
require("dotenv").config({path: "./config/.env"})

//Passport configuration
require('./config/passport')(passport)
//connect to DB 
connectDB()

//Views Engine 
app.set("view engine", "ejs")
//Public files middleware
app.use(express.static('public'))
//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Logging dev activity
app.use(morgan('dev'))

//Setup sessions in MongoDB
app.use(session({
    secret:"secret",
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: process.env.DB_STRING}
        ),
    })
)
//Pasport Middleware
app.use(passport.initialize())
app.use(passport.session())



//override form method for put and delete 
app.use(methodOverride("_method"));

//Set up flash messages for errors
 app.use(flash())



//set up the middleware for the routes which the server is listening
app.use("/pills", pillRoutes)
app.use('/', mainRoutes)
app.use('/reminder' , reminderRoutes)



app.listen(process.env.PORT, () =>{
    console.log('Server is running, catch it if you can')
})








































































































































































