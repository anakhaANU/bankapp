// import mongoose

const mongoose=require('mongoose')

// conncet server and mongodb

mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true
})

// create model

const User = mongoose.model('User',{
    acno: Number,
    uname: String,
    password:Number, 
    balance:Number,
    transaction: [] 
})

// export model

module.exports={
    User
}