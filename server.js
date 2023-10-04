import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import User from "./models/User.js";
import {dirname} from "path";
import {fileURLToPath} from "url";
import cors from "cors";

const app = express();
const port = 3001;
const __dirname = dirname( fileURLToPath( import.meta.url ) );

app.use(cors());
app.use( bodyParser.urlencoded( {extended:true} ) );

await mongoose.connect("mongodb://localhost:27017/todoDB" , {family: 4}).then(console.log("Connected to Database"));

app.post("/register", async (req,res)=>{
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const checkExistance = await User.find({username: username});
    if(checkExistance.length > 0){
        res.send("exists");
    }else{
        const user = await User({
            username: username,
            password: password,
        });
        user.save();
        res.send({todos: user.todos , userID: user._id});
    }
});

app.post("/login", async (req,res)=>{
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    try{
        const user = await User.findOne({username: username, password: password});
        res.json({todos: user.todos , userID: user._id});
    }catch(err){
        res.send("error");
    }
});

app.post("/todos/new", async (req, res)=>{
    const user = await User.findById(req.body.userID);
    const todo = {
        text: req.body.text
    }
    user.todos.push(todo);
    user.save();
    res.json(user.todos);
});

app.patch("/todos", async (req, res)=> {
    const user = await User.findById(req.body.userID);
    const id = req.body.todoID;
    const indexToPatch = user.todos.findIndex(element => element.id === id);
    if(indexToPatch === -1){
        res.send("not exist");
    }else{
        const todoState = user.todos[indexToPatch].isCompleted;
        user.todos[indexToPatch].isCompleted = !todoState;
        user.save();
        res.json(user.todos);
    }
});

app.delete("/todos", async (req,res)=>{
    const user = await User.findById(req.query.userID);
    const id = req.query.todoID;
    const indexToDelete = user.todos.findIndex(element => element.id === id);
    if(indexToDelete === -1){
        res.send("not exist");
    }else{
        user.todos.splice(indexToDelete, 1);
        user.save();
        res.json(user.todos);
    }
});

app.listen(port , ()=>{
    console.log(`Server is listening at port ${port}`);
});