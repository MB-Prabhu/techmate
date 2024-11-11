const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const app = express()



app.use(express.json())
app.use(cookieParser())


const profileRouter = require('./routes/profileroute')
const authRouter = require('./routes/authroute')
const connectionRouter = require('./routes/connectionroute')
const loggedUser = require('./routes/loggedUser')

app.use('/', profileRouter)
app.use('/', connectionRouter)
app.use('/', authRouter)
app.use('/', loggedUser)

app.post('/user', async (req, res)=>{
   try{
    // console.log(req.body.email)
    const {email} = req.body 

    if( req.body?.skills.length>10){
        throw new Error("skills should be under 10 ")
    }

    const user = await userModel.findOne({email: email})
    console.log(user)
    if(user){
        res.status(200).json({msg: "user available", data: user})
    }
    else{
        res.status(400).json({msg: "user not available"})
    }
   }
   catch(err){
    console.log(err.message)
   }
})

app.delete('/user', async (req, res)=>{
    try{
        console.log(req.body.userID)
        let {userID} = req.body 
         const deleted= await userModel.findByIdAndDelete({_id: userID})
        console.log(deleted)
        if(deleted){
            return res.json({msg: "deleted successfully", data: deleted})
        }
        res.json({msg: " not deleted"})
       }
       catch(err){
        console.log(err.message)
       }
})

app.put('/user/:sid', async (req, res)=>{
    const {sid} = req.params
    console.log(req.params)
    const updatedData = req.body

   
    const isAvailable = await userModel.find({_id: sid})
    if(isAvailable){
        if(updatedData?.skills.length>10){  
            throw new Error("skills should be under 10 ")
        }    
        const updateAllowedField = ["age", "photourl"]

        let isAllowed =  Object.keys(updatedData).every(it=> updateAllowedField.includes(it))
          if(!isAllowed){
                 throw new Error("updates not allowed for some fields")
          }
       const updated =  await userModel.findByIdAndUpdate({_id: sid}, updatedData, {returnDocument: "after", runValidators: true}) //second parameter is used to pass the new data which needs to update, this 3rd parameter is used for options where this returnDocument is used to return the updated doument if we pass after or else it will return the previous doucment if we gave before
    //    OR
    //    const updated =  await userModel.findByIdAndUpdate(sid, updatedData, {returnDocument: "after"}) //second parameter is used to pass the new data which needs to update, this 3rd parameter is used for options where this returnDocument is used to return the updated doument if we pass after or else it will return the previous doucment if we gave before
        res.json({msg: "user updated", data: updated})
    }
    else{
        return res.json({msg:"user not updated"})
    }
})

app.get("/feed", async (req, res)=>{
  try{
    
    const users =  await userModel.find({})
    console.log(users)
    if(users.length>0){
     res.json({data: users})
    }
    else{
     res.json({msg: "no users available"})
    }
  }
  catch(err){
    console.log(err.message)
  }
})

connectDB().then(()=>{
    console.log("db connected successfully")
    app.listen(4000, ()=>{
        console.log("running at http://localhost:4000")
    })
})
.catch(err=> console.log(err))
