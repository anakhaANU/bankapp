const jwt = require('jsonwebtoken')

const db = require('./db')

database = {
  1000: { acno: 1000, uname: "Neer", password: "1000", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Ravi", password: "1001", balance: 4000, transaction: [] },
  1002: { acno: 1002, uname: "Ram", password: "1002", balance: 6000, transaction: [] }
}

const register = (acno, uname, password) => {
  // let database=this.data

  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          status: false,
          statusCode: 401,
          message: "account already exist!!! please login"
        }

      }
      else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []

        })
        newUser.save()
        return {
          status: true,
          statusCode: 200,
          message: "account successfully created"

        }

      }
    })

  
}
const login = (acno, password) => {
  return db.User.findOne({
    acno,
    password
  }).then(user=>{
    if(user){
      currentUsername=user.uname
      //token gnrte

      const token = jwt.sign({
        currentAcno: acno

      }, 'supersecretkey12345')

      // console.log(req.session)

      return {
        status: true,
        statusCode: 200,
        message: "login successful",
        currentUsername: currentUsername,
        currentAcno: acno,
        token


      }
    }
    else{
      return {
        status: false,
        statusCode: 401,
        message: "invalid account number / password"
      }

    }
  })



}



const deposit = ( acno, password, amnt) => {
  var amount = parseInt(amnt)
  return db.User.findOne({
    acno,
    password
  }).then(user=>{
    if(!user){
      return {
        status: false,
        statusCode: 401,
        message: "invalid account number / password"
      }
    }
    user.balance+=amount
    user.transaction.push({
      amount:amount,
      Type:"CREDIT"
    })
    user.save()
    return{
      status:true,
      statusCode:200,
      message:amount + " credited. new balance is :" +user.balance
    }
  })
  }


const withdraw = (req,acno, pswd, amnt) => {
  var amount = parseInt(amnt)
  return db.User.findOne({
    acno,
    password:pswd
  }).then(user=>{
    if(req.currentAcno!=acno){
      return {
        status: false,
        statusCode: 401,
        message: "operation denid"
      }

    }
    if(!user){
      return {
        status: false,
        statusCode: 401,
        message: "invalid account number / password"
      }
    }
    if(user.balance<amount){
      return {
                status: false,
                statusCode: 401,
                message: "insufficient balance"
              }

    }
    user.balance-=amount
    user.transaction.push({
      amount:amount,
      Type:"DEBIT"
    })
    user.save()
    return{
      status:true,
      statusCode:200,
      message:amount + " debited. new balance is :" +user.balance
    }
  })
  }


const getTransaction = (acno) => {
  return db.User.findOne({acno})
  .then(user=>{
    if(!user){
      return{
        status: false,
      statusCode: 401,
      message: "user doesnot exist"

      }
    }
    else{
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
  
      }
    }
  })

}
//delete acc
const deleteAcc=(acno)=>{
 return db.User.deleteOne({
    acno
  }).then(user=>{
    if(!user){
      return{
        status: false,
      statusCode: 401,
      message: "user doesnot exist"

      }

    }
    return{
      status: true,
    statusCode: 200,
    message: "Account number"+acno+"deleted successfully"

    }
  })
}


module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}

