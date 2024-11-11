const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" //it creates a reference of ref 
    },

    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    connectionStatus: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "accepted", "interested", "rejected"],
            message: `{VALUE} is incorrect connection status type`
        }
    }


},{
    timestamps: true
})

connectionSchema.index({senderId: 1, receiverId: 1})
// this pre is a function where it is going to execute before we are saving into the database
// and 1st argument we have given save which is like event
connectionSchema.pre("save", function(next){
    const connectionRequest = this
   if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
    throw new Error("Cant send connection request to yourself")
   }
   next()
})

const connectionModel = new mongoose.model("ConnectionModel", connectionSchema)
module.exports = connectionModel