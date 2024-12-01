const express = require('express')
const {userAuth} = require('../middlewares/auth')
const userModel = require('../models/user') 
const connectionModel = require('../models/connectionRequest')
const user = require('../models/user')
let loggedUser = express.Router()

let allowedFields = ["firstName", "lastName", "age", "gender", "skills"]
// this api is used to find the connections, which are in pending (for the loggined user)
loggedUser.get('/user/request', userAuth, async (req, res)=>{
    try{
        let loggedInUser = req.user

        const pendingRequestUser = await connectionModel.find({
           receiverId: loggedInUser._id,
           connectionStatus: "interested"
        }).populate("senderId", allowedFields) // you can specify whcih things to send in the reponse in array format or  just by using string also wher ethe fields shoudl be separated by space
       
    //    const allUser = await userModel.findOne({_id: pendingRequestUser.senderId})
    //     res.json({data: allUser})

    res.status(200).json({msg: "data fetched successfully", data: pendingRequestUser})

    }
    catch(err){
        res.status(404).json({msg: err.message})
    }
})

loggedUser.get('/user/connections', userAuth, async (req, res)=>{
   try{
    const loggedInUser = req.user
    const connectionUsers = await connectionModel.find({
          $or: [
              {receiverId: loggedInUser._id, connectionStatus: "accepted"},
              {senderId: loggedInUser._id, connectionStatus: "accepted"}
          ]
      }).populate("senderId", allowedFields).populate("receiverId", allowedFields)
      
     const data = connectionUsers.map(row=>{
            if(row.senderId._id.toString() === loggedInUser._id){
                return row.receiverId
            }
            return row.senderId
      })

      res.status(200).json({msg: "data fetched successfully", data: connectionUsers})  
   }
   catch(err){
    res.status(404).json({msg: err.message})
   }
})  

loggedUser.get('/user/feed', userAuth, async (req, res)=>{
    try {
    const loggedInUser = req.user
         let page = parseInt(req.query.page) || 1
         let limit = parseInt(req.query.limit) || 10
         limit = limit > 20 ? 20 : limit 
         let skip = (page-1) * limit 

    let  connectionUsers = await connectionModel.find({$or: [{receiverId: loggedInUser._id}, {senderId: loggedInUser._id}]}).select("senderId receiverId")

        const hideUsers = new Set()
         connectionUsers.map(e=> {
            hideUsers.add(e.senderId.toString())
            hideUsers.add(e.receiverId.toString())
            
        })
        
       const feedData = await userModel.find({$and: [
        {_id: {$nin: Array.from(hideUsers)}},
        {_id: {$ne: loggedInUser._id}}  
       ]}).select(allowedFields).skip(skip).limit(limit)

       res.status(200).json({msg: "used data got", data: feedData})
    } catch (err) {
    res.status(404).json({msg: err.message})
    }
}) 

module.exports= loggedUser

