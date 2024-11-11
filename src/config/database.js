const mongoose = require('mongoose')

const connectDB = async ()=>{
     await mongoose.connect('mongodb+srv://practicenode:Z6N9a8Wi11q5GcIp@practicenode.24ocy.mongodb.net/techmateDB?retryWrites=true&w=majority')
} 
   
module.exports = connectDB
         