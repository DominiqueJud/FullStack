const MONGODB_URL=process.env.MONGODB_URL
const mongoose=require("mongoose")

personSchema=mongoose.Schema({
    name:String,
    number:String,
})

personSchema.set("toJSON",{
    transform: (document, returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

mongoose.set("strictQuery", false)

console.log("connecting to MongoDB")
mongoose.connect(MONGODB_URL)
.then(result=>{
    console.log("connection to MongoDB established")
})
.catch(error=>{
    console.log("error connectiong to MongoDB", error.message)
})


module.exports= mongoose.model("Person",personSchema)