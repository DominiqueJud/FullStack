const mongoose=require('mongoose')
const userRouter=require('express').Router()
const bcrypt = require('bcrypt')
const User=require('../models/users')
const Blog=require('../models/blogs')

userRouter.get('/', async (request,response) => {
    const users= await User.find({}).populate('blogs',{title:1,url:1,author:1,likes:1})
    response.status(200).json(users)
})

userRouter.post('/',async (request, response) => {
    const {username, name, password} = request.body
    if(!(username&&password)){
        return response.status(400).send({message:'username and password required'} )
    }
    else if(username.length<3 || password.length<3){
        return response.status(400).send({message:'username and password must be at least 3 charcters long'})
    }
    const saltedRounds=10
    const passwordHash=await bcrypt.hash(password,saltedRounds)

    const user=new User({
        username:username,
        name:name,
        passwordHash:passwordHash,
        blogs:[]
    })
    
    const savedUser=await user.save()
    response.status(201).json(savedUser)
})

userRouter.delete('/all', async (request, response) => {
    await User.deleteMany({})
    response.status(201).send()
})

module.exports=userRouter