const express = require("express")
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const postsRoute=require('./routes/posts')
dotenv.config();
// IMPORT ROUTES
const authRoute = require('./routes/auth');

// Connect to db
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser:true},
    
    mongoose.set('strictQuery', true),
    () => console.log("Connected to db"))


// Middleware
app.use(express.json());

// Route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts',postsRoute)

app.listen(3000, () => ("Serve is up and running"))