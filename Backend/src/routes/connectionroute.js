const express = require('express')
const {userAuth} = require('../middlewares/auth')
const connectionModel = require('../models/connectionRequest')
const userModel = require('../models/user') 
let requestRouter = express.Router()

requestRouter.post('/connectionreqest/send/:status/:userId', userAuth,async (req, res)=>{
    try{
    const senderId = req.user._id
    const receiverId = req.params.userId
    const connectionStatus= req.params.status
        console.log(senderId)
        console.log(receiverId)
        console.log(connectionStatus)

        const allowedStatus = ["interested", "ignored"]
        let isAllowed = allowedStatus.includes(connectionStatus)
        if(!isAllowed){
            return res.status(404).json({msg: "invalid connection request"})
        }     
        
        const toUser = await userModel.findById(receiverId)
       
        if(!toUser){
            res.status(404).json({msg: "user not found"})
        }

        //index has made to make the query faster in connectionRequest Schema
        const existingConnectionRequest = await connectionModel.findOne({
            $or:[
                {senderId, receiverId}, //it checks wheather the sender has already sent the connect=qtion request to the receiver
                {senderId: receiverId, receiverId: senderId} //this line checks wheather sender has sent request to reciver or receiver has sent request to sender if this anyone has sent dont allow sent connection request again to the either of the user
            ]
        })

        if(existingConnectionRequest){
            res.status(400).json({msg: "connection request already has made"})
        }

    const connectionRequest = new connectionModel({
        senderId,
        receiverId,
        connectionStatus 
    }) 

    await connectionRequest.save()
    res.status(200).json({msg: "Connection Request Sent", data: connectionRequest})
    }
    catch(err){
        res.status(404).json({msg: err.message})
    }
             
}) 

requestRouter.post('/connectionreqest/receive/:status/:reqId',userAuth, async (req, res)=>{
   try{
    const loggedInUser = req.user
    const status = req.params.status
    const reqId = req.params.reqId

    let allowedStatus = ["accepted", "rejected"]
    if(!allowedStatus.includes(status)){
        return res.status(400).json({msg: "status not allowed"})
    }
       
    const connectionRequest = await connectionModel.findOne({
        receiverId: loggedInUser._id, //it checks wheather the user who is accepting the connection request is loggedIn user or not and if he is logged in his id is present in connectionRequest database or not
        connectionStatus: "interested", 
        _id: reqId //checks the unique doucments id which has made when the connection request has sent
    })
                                
    if(!connectionRequest){
        return res.status(404).json({msg: "User not found"})
    }

    connectionRequest.connectionStatus = status
    const data = await connectionRequest.save()

    res.status(200).json({msg: "connection request accepted", data})
   }
   catch(err){
    res.status(404).json({msg: err.message})
   }
})

module.exports = requestRouter