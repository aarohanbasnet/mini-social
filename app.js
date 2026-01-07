
const express = require('express');
const app = express();
const userModel = require('./model/user');
const postModel = require('./model/post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const path = require('path');


const PORT = 3000;

app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());



app.get("/", (req,res)=>{
    res.render("index");
});


app.listen(PORT, ()=>{
    console.log(`server is running in http://localhost:${PORT}`)
});