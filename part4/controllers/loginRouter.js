const bcrypt=require('bcrypt')
const loginRouter=require('express').Router()
const User=require('../models/users')
const jwt=require('jsonwebtoken')

loginRouter.post('/',async (request, response ) => {
    const {username, password}=request.body
    const user= await User.findOne({username:username})
    if(!user)return response.status(401).send('invalid username or password')
    const correctPassword= user === false
    ? false
    : await bcrypt.compare(password,user.passwordHash)
    if(!(correctPassword && user)){
        return response.status(401).send('invalid username or password')
    }
    const newUser={username:user.username,id:user._id}
    const autToken= jwt.sign(newUser,process.env.SECRET)
    response.status(200).json({autToken,username:user.username,name:user.name})

})

module.exports=loginRouter