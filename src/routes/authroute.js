const express = require('express')

const userModel = require('../models/user') 
const {validation} = require('../utils/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let authRouter = express.Router()

authRouter.post('/signup', async (req, res)=>{
    try{
     validation(req)
     const {firstName, lastName, age, email, password} = req.body
     const passowordHash =await  bcrypt.hash(password, 10) // 10 is the no of rounds the password should hash, the more you encrypt the more it becomes strong
     // console.log(passowordHash)
     const newUser = new userModel({
         firstName, 
         lastName, 
         age, 
         email, 
         password: passowordHash
     })
         // console.log(Date.now().toFixed())
     await newUser.save()
     res.send("saved to db ")
    }
    catch(err){
     console.log(err.message)
     res.status(400).json({msg: err.message})
    }
 })
 
 authRouter.post('/login', async (req, res)=>{
     try{
         const {email, password} = req.body
        const user =  await userModel.findOne({email: email})
        if(!user){
         throw new Error("Email Id is not registered")
        }
 
        //    const isPasswordMatch = await bcrypt.compare(password, user.password) // kept this code in user.js where we have defined the schema
     //    above method is also working fine but here good practice is to separate the code
        const isPasswordMatch = await user.validatePassword(password)
     //    console.log(isPasswordMatch)
        if(isPasswordMatch){
         const token = await user.getJWT();
         res.cookie('login', token, {expires: new Date(Date.now() + 8 * 300000) }) //"expires" expires the cookie
         res.status(200).json({msg: "loggin successfull"})
        }
        else{
         res.status(404).json({msg: "password not correct"})
        } 
     }
     catch(err){
         res.status(404).json({msg: err.message})
     }
 })


 authRouter.post('/logout', (req, res)=>{
    res.cookie("login", null, {expires: new Date(Date.now())})
    res.status(200).json({msg: "user logged out successfully"})
 })

module.exports=authRouter