
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

app.post("/create", async (req,res)=>{
    let {name, username, email, age, password} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User already exists, please login");
    
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
            let user =  await userModel.create({
                name,
                 username, 
                 email,
                 age,
                 password : hash       
            });
        });
    });
});


app.listen(PORT, ()=>{
    console.log(`server is running in http://localhost:${PORT}`)
});