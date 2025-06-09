const express = require("express")
// express variable assigned to import of the express package
const app = express()
// reassingning the express variable
const mongoose = require('mongoose')
// variable assigned to imported mongoose package (handles interfacing with the database)
const passport = require('passport')
// variable assigned to imported passport package (handles our authentication * add google oauth20)
const session = require('express-session')
// variable assigned to imported exp session package (handles sessionallowing sessions to persist)
const morgan = require('morgan')
// variable assigned to imported morgan package (hanles logging requests to the console) 
const flash = require('express-flash')
// variable assigned to imported flash package(handles error or success messaging ) 
const nodeMailer = require('nodemailer')
// variable assigned to imported nodemailer package(handles sending reminder emails to the user email)
const cron = require('node-cron')
// variable assigned to imported node-cron package(handles the timing of ) 
const MongoStore = require('connect-mongo')
// variable assigned to imported connect-mongo package(handles creation of sessions in our app)
const methodOverride = require('method-override')
// variable assigned to imported method-override package(overrides native form methods)
const connectDB = require('./config/database')
// variable assigned to imported database connection function 
const pillRoutes = require('./routes/pills')
// variable assigned to importing pill routes
const mainRoutes = require('./routes/main')
// variable assigned to importing main routes
const reminderRoutes = require('./routes/reminder')
// variable assigned to importing reminder routes
const dashboardRoutes = require('./routes/dashboard')

//Env path in config dir
require("dotenv").config({path: "./config/.env"})
// requires .env files where all private files are located


//Passport configuration
require('./config/passport')(passport)
// importing passport file for authentication

//connect to DB 
connectDB()
// calling db connection to connect the app


//Views Engine 
app.set("view engine", "ejs")
// settig the view engine to ejs

//Public files middleware
app.use(express.static('public'))
// setting up the middleware that handles location for client side files


//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// middleware used for parsing data to and from the database (replaced body parser)



//Logging dev activity
app.use(morgan('dev'))
// miiddleware used to log all request setn to and from the app


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
// setting up sessions in mongoDB for sessions to persist


//Pasport Middleware
app.use(passport.initialize())
// integration of the passport middleware into the express app for authentication
// this initializes the process
app.use(passport.session())
// creates auhtentication that persists though sessions


//override form method for put and delete 
app.use(methodOverride("_method"));

//Set up flash messages for errors
 app.use(flash())



//set up the middleware for the routes which the server is listening
app.use("/pills", pillRoutes)
app.use('/', mainRoutes)
app.use('/reminder' , reminderRoutes)
app.use('/dashboard', dashboardRoutes)


// listening for actions on the PORT and logging a message to the pORT
app.listen(process.env.PORT  || PORT, () =>{
    console.log('Server is running, catch it if you can')
})








































































































































































