const path = require('path')
const express = require('express');
// const mongoose = require('mongoose')
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/.env' })

// Passport Config
require('./config/passport')(passport)

// connect to your DataBase
connectDB()

const app = express()  

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Overide
app.use(
    methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method 
    return method
    }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlerbars
app.engine('.hbs', exphbs.engine({ helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs'); 


// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
         mongoUrl: "mongodb+srv://anu-akin:anu-akin@personal-diary-project.f9hbr.mongodb.net/PDDatabase?retryWrites=true&w=majority",
    })
}))

//  Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set Globa Variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static folder 
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/memories', require('./routes/memories'))


const PORT = process.env.PORT || 3000
 
app.listen(PORT, console.log(`Server Started Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`))