const logger= require('./logger')
const User=require('../models/users')
const jwt=require('jsonwebtoken')


const getAuthToken= (request)=> {
    const authorization=request.get('authorization')
    if(authorization&&authorization.startsWith('Bearer ')){
      return authorization.replace('Bearer ','')
    }
    return null
  }

  const decodeToken= (request) => {
    if(request.token!=null){
      try{
      const decodedToken=jwt.verify(request.token,process.env.SECRET)
      return decodedToken
    }
    catch(error){logger.error(error.message)
    }}
    return null
  }

const unknownEndpoint=(request, response) => {
    response.status(404).send({error:'unknown Endpoint'})
}

const errorHandler= (error, request, response, next) => {
logger.error(error.message)

if(error.name==='CastError'){
    return response.status(400).send({error:'malformatted id'})
}
else if(error.name==='ValidationError'){
    return response.status(400).json({error:error.message})
}
else if(error.name==='MongoServerError'&& error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({error:'expect username to be unique'})
}
else if(error.name=='JsonWebTokenError'){
    return response.status(401).json({error:''})
}
}
const tokenExtractor= (request, response, next) => {
    request.token=getAuthToken(request)
    next()
}

const userExtractor= (request, response, next) => {
    request.user = decodeToken(request)?.id
    next()
}
module.exports= {errorHandler, unknownEndpoint, tokenExtractor, userExtractor}