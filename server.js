
const express = require ('express');
const app=express();

//import route files
const userRoutes= require ('./routes/user')
const adminRoutes=require('./routes/admin')

//core modules and middlewares
const path= require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./db/connectDB');
const nocache= require('nocache')

//view engine and views folder
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','hbs')

app.use(express.static('public'));

app.use(nocache())//Disable caching so that back button doesn't show old pages


app.use(cookieParser());


// Parse form data (urlencoded) and JSON payloads
app.use(express.urlencoded({extended : true}))
app.use(express.json())

// Configure session middleware
app.use(
  session({
    secret: 'yourSecretKey', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  })
);


app.use('/user',userRoutes);
app.use('/admin',adminRoutes);


//connect MongoDB
connectDB();

app.listen(3000,()=>{
    console.log("***********Started************"); 
})