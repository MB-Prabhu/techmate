const userModel = require('../models/user')
const jwt = require('jsonwebtoken')

const userAuth = async (req, res, next)=>{
   try{
// req.cookies stores all the cookies in form of object 
// Eg: {
//   login: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // This is the JWT token
// }
    const {login} = req.cookies
    if(!login){
        throw new Error("invalid Token")
       }
    const decodedData = await jwt.verify(login, "TechMate@123") // it is going to check wheather the token is correct or not with the help of secret key "TechMate@123"
   const {_id}= decodedData
    const authenticUser =  await userModel.findById(_id) 
    if(!authenticUser){
        throw new Error("User is not found")
      }
      
    req.user = authenticUser //here we are creating the user field separelty
    
    next()
   }
   catch(err){
    res.status(404).json({msg: err.message})                                    
   }
}                                    


const userValid = (req, res)=>{
   const {login} = req.cookies
}

module.exports = {userAuth}