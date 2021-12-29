// import express
const express = require('express')
const dataServices=require('./services/data.services')

const session=require('express-session')

const jwt=require('jsonwebtoken')

const cors = require('cors')

//create app using expr
const app=express()

// use cors

app.use(cors({
    origin:'http://localhost:4200',
    credentials:true  
}))

//use session
app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
    
}))

// parse  json

app.use(express.json())

//appli specific middileware

app.use((req,res,next)=>{
    console.log("Application specific Middleware")
    next()

})

// router specific 

const lowMiddleware=(req,res,next)=>{
    if(!req.session.currentAcno){

        res.json({
          status:false,
          statusCode:401,
          message:"please login!!!"
        })
          }
          else{
              next()
          }

}

//jwt middleware

const jwtMiddleware=(req,res,next)=>{
   try {
    //    const token=req.body.token
           

        // fetching token from request headders
        
            const token=req.headers["x-access-token"]

    // token validation
    const data=jwt.verify(token,'supersecretkey12345')
    req.currentAcno=data.currentAcno
    next()
}
    catch{
        res.json({
            status:false,
            statusCode:401,
            message:"please login!!!"
          })
    }
}

// api for token

app.post('/token',jwtMiddleware,(req,res)=>{
    res.send("current account number is:"+req.currentAcno)
})
//define default router

app.get('/',(req,res)=>{
    res.status(401).send("GET METHOD")
})

app.post('/',(req,res)=>{
    res.send("POST METHOD")
})

app.delete('/',(req,res)=>{
    res.send("DELETE METHOD")
})

app.post('/register',(req,res)=>{
    console.log(req.body)
   const result= dataServices.register(req.body.acno,req.body.uname,req.body.password)
    .then(result=>{
        res.status(result.statusCode).send(result)

    })
    })

app.post('/login',(req,res)=>{
    console.log(req.body)
   const result= dataServices.login(req.body.acno,req.body.pswd)
   .then(result=>{
    res.status(result.statusCode).send(result)

   })
})

//deposit api
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req.body)
    dataServices.deposit(req.body.acno,req.body.pswd,req.body.amnt)
    .then(result=>{
        res.status(result.statusCode).send(result)
    })
})

app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log(req.body)
   const result= dataServices.withdraw(req,req.body.acno,req.body.pswd,req.body.amnt)
   .then(result=>{
    res.status(result.statusCode).send(result)
 
   })
})

app.post('/getTransaction',jwtMiddleware,(req,res)=>{
    console.log(req.body)
    dataServices.getTransaction(req.body.acno)
   .then(result=>{
    res.status(result.statusCode).send(result)

   })
})

app.patch('/',(req,res)=>{
    res.send("PATCH METHOD")
})

app.put('/',(req,res)=>{
    res.send("PUT METHOD")
})

// delete acc api

app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
    dataServices.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).send(result)
    
       })
})

//set port

app.listen(3000,()=>{
    console.log("server started at port number 3000")
})