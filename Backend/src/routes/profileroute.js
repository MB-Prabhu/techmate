const express = require('express')
const {userAuth} = require('../middlewares/auth')
const {validateProfileEditData} = require('../utils/validation')
const bcrypt = require('bcrypt')
const profileRouter = express.Router()

profileRouter.get('/profile/view', userAuth, async (req, res)=>{
    try{
      let singleUser = req.user
     res.status(200).json({data: singleUser})
    }
    catch(err){
      res.status(404).json({error: true, msg: err.message}) 
    }
  })

  profileRouter.patch('/profile/edit', userAuth, async (req, res)=>{
   try{  
    const isValidEdit =  validateProfileEditData(req)
    
   if(!isValidEdit){
    throw new Error("Invalid Edit Request")
   }

    const loggedInUser =  req.user
    console.log(loggedInUser) 

     Object.keys(req.body).forEach(field=> {
      (loggedInUser[field] = req.body[field])
   })

  // loggedInUser.age= req.body.age 
  // loggedInUser.gender = req.body.gender
  // loggedInUser.skills = req.body.skills
    await loggedInUser.save()

    res.status(200).json({msg: "updated successfully", data: loggedInUser})
   }
   catch(err){
    res.status(404).json({msg: err.message})
   }
  })

  profileRouter.patch('/profile/password', userAuth ,async (req, res)=>{
    try{
      const { password } = req.body
    if(!password){
      throw new Error("password not valid")
    } 

   let loggedInUser = req.user
   
   //  loggedInUser.password = password //New Password: Nandha
   const hashedPassword = await  bcrypt.hash(password, 10)
   loggedInUser.password = hashedPassword
   await loggedInUser.save
   console.log(loggedInUser)
   res.status(200).json({msg: "password updated"})
    }
    catch(err){
      res.status(404).json({msg: err.message})
    }
  })

  module.exports=profileRouter