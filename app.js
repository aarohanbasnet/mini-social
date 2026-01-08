
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

            let token = jwt.sign({email : email, userid : user._id}, "secret");
            res.cookie("token", token);
            res.send("registered");
        });
    });
});

app.get("/login", (req,res)=>{
    res.render("login");
})


app.post("/login", async (req, res)=>{
    let {email, password} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("something went wrong");

    bcrypt.compare(password, user.password, function(err, result){
        let token = jwt.sign({email : email, userid : user._id}, "secret");
        res.cookie("token", token);
        if(result)  return res.status(200).redirect("/profile");
        else res.send("credentials doesnot match!");
    })
});


app.get("/logout", (req, res)=>{
     res.cookie("token", "");
     res.redirect("/login");
});


app.get("/profile",isLoggedIn, async (req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    console.log(user);
    res.render("profile", {user});
});



function isLoggedIn(req, res, next){
    if(req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "secret");
        req.user = data;
        next();
    }
}


app.listen(PORT, ()=>{
    console.log(`server is running in http://localhost:${PORT}`)
});