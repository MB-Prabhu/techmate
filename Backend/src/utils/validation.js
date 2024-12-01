const validator = require('validator')
const validation = (req)=>{
    const {firstName, lastName, age, email, password} = req.body
   if(!firstName || !lastName){
    throw new Error("Fill the Name fields")
   }
   else if(!validator.isEmail(email)){
    throw new Error("Email is not proper")
   }
   else if(!validator.isStrongPassword(password)){
    throw new Error("password is not strong")
   }
 }

 const validateProfileEditData = (req)=>{
    const allowedEditFields = ["age", "gender", "skills"]
   const isValidEdit = Object.keys(req.body).every(field=> allowedEditFields.includes(field))
   return isValidEdit
 }

 module.exports={
  validation,
validateProfileEditData}