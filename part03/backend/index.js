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

let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get("/", (request, response)=>{
    response.send("<h1>Hello</h1>")
})

app.get("/api/persons", (request, response)=>{
    response.json(persons)
})

app.get("/api/persons/:id",(request,response)=>{
    const id= Number(request.params.id)
    const person=persons.find(person=> person.id==id)
    console.log(person, id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).json({error:"id not found"})
        console.log("person not found")
    }


})


app.get("/info", (request, response)=>{
    const date= new Date()
    response.send(`<p>Phonebook has info for ${persons.length} persons<br/>
        ${date}</p>`)
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
    const personWithSameName=persons.find(person=> person.name===body.name)
    if(personWithSameName){
        return response.status(400).json({error:"person with the same name is already in the Phonebook"})
    }
    const person={
        "id":Math.trunc(Math.random()*99999),
        "name": body.name,
        "number": body.number
    }
    persons=persons.concat(person)
    console.log(person, "addet to the server")
    response.json(person)
})

app.delete("/api/persons/:id", (request,response)=>{
    const id=Number(request.params.id)
    const person=persons.find(person=>person.id==id)
    if(person){
        persons=persons.filter(person => person.id !==id)
        response.status(204).end()
    }
    else{
        response.status(204).end()
        console.log("no user to delete with this id")
    }
})

const unknownEndpoint=(request, response)=>{
    response.status(404).json({error:"unknown Endpoint"})
}

app.use(unknownEndpoint)

const PORT= process.env.PORT||3001 
app.listen(PORT)
console.log(`app listens to ${PORT}`)