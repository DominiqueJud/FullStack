require("dotenv").config()
const express=require("express")
const app=express()
const morgan=require("morgan")
app.use(express.json())
app.use(express.static("dist"))



morgan.token("reqData",(req,res)=>{
    console.log(req.body)
    if (JSON.stringify(req.body)!="{}"){
    return JSON.stringify(req.body)}
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :reqData"))



app.get("/", (request, response)=>{
    response.send("<h1>Hello</h1>")
})

app.get("/api/persons", (request, response)=>{
    Person.find({})
    .then(result=>{
        response.json(result)
    })
})

app.get("/api/persons/:id",(request,response)=>{
    Person.findById(request.params.id)
    .then(person=>{
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error =>next(error))
})


app.get("/info", (request, response)=>{
    const date= new Date()
    Person.find({})
    .then(persons=>{
    response.send(`<p>Phonebook has info for ${persons.length} persons<br/>
        ${date}</p>`)})
})

app.post("/api/persons", (request,response)=>{
    let body=request.body
    if (!body){
        return response.status(400).json("content missing")
    }
    if(!body.name){
        return response.status(400).json({error:"name missing in the request"})
    }
    if(!body.number){
        return response.status(400).json({error:"number missing in the request"})
    }
    const person=new Person({
        name: body.name,
        number: body.number
    })
    console.log(person, "addet to the server")
    person.save().
    then(result=>{
        response.json(person)
        console.log(`${person} was sent to the Database`)
    })
})

app.delete("/api/persons/:id", (request,response, next)=>{
    Person.findByIdAndDelete(request.params.id)
    .then(person=>{
        response.status(204).end()}
    )
    .catch(error=>next(error))
})

app.put("/api/persons/:id", (request,response,next)=>{
    const body=request.body
    const person={
        name:body.name,
        number:body.number,
    }
    Person.findByIdAndUpdate(request.params.id,person,{new:true})
    .then(updatedPerson=>{
        response.json(updatedPerson)
    })
    .catch(error=>next(error))
})

const unknownEndpoint=(request, response)=>{
    response.status(404).json({error:"unknown Endpoint"})
}

app.use(unknownEndpoint)


const errorHandler=(error,response,request,next)=>{
    console.log(error.message)
    if(error.name==="CastError"){
        return response.status(400).send({error:"malformatted id"})
    }
    next(error)
}

app.use(errorHandler)
const Person=require("./modules/person.js")


const PORT= process.env.PORT||3001 
app.listen(PORT)
console.log(`app listens to ${PORT}`)