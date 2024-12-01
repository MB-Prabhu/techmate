const mongoose = require('mongoose')

const connectDB = async ()=>{
     await mongoose.connect('mongodb+srv://practicenode:mhFLhh0dw2Ph3ube@practicenode.24ocy.mongodb.net/?retryWrites=true&w=majority&appName=practicenode')
     // await mongoose.connect('mongodb+srv://practicenode:mhFLhh0dw2Ph3ube@practicenode.24ocy.mongodb.net/techmateDB?retryWrites=true&w=majority')
} 
   
module.exports = connectDB
          