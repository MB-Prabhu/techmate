const  jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        minlength: [3, "firstname should be atleast 3 character long"],
        required: true,
        // unique: true,
        trim: true,
        default: "arun",
        unique: true,
          
    },
    lastName: {
        type: String,
        minlength: [3, "firstname should be atleast 3 character long"]
    },
    email:{
        type: String,
        required: true,
        unique: true, // if we make unique: true mongodb automaically convert it as index so we dont need to mention index: true explilcitely
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address" + value)
            }
        }
    },
    password: {
      required: true,
      type: String,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Not a Strong password" + value)
        }
    }  
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 80
    },
    // photourl: {
    //     type: String,
    //     default: "image address",
    //     validate(value){
    //         if(!validator.isURL(value)){
    //             throw new Error("invalid photo URL" + value)
    //         }
    //     }
    // },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid gender type`
        }
        // this validate method will run only on creating a new record not on updating the existing document
        // if you want to validate in updation process also then you have to enable
        //  validate(value){
        //     if(!["male","female","others"].includes(value))
        //     {
        //         throw new Error("Gender is not valid");
        //     }
        //  }
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true 
}
)
 
userSchema.methods.getJWT = async function(){
    
    //the this keyword is refering the doucments inside the model(each document is instance of the model, so this keyword refers to the documents )
    const user = this 

    const token = await jwt.sign({_id : user._id}, "TechMate@123", {expiresIn: "3d"}) //expiresIn expires the token
    return token
}

userSchema.methods.validatePassword = async function(passwordByUser){
    const user = this
    const passwordHashed = user.password
   const isPasswordMatch = await bcrypt.compare(passwordByUser, passwordHashed) // first we should put the user sended passoword and 2nd arg pass the password which is stored in database dont interchange the password
   return isPasswordMatch // gonna return true or false
}



module.exports = mongoose.model('User', userSchema)