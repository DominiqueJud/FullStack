const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('please enter a Password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://viewingrug4:${password}@testmongodb.qckfivh.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=TestMongoDB`

mongoose.set('strictQuery', false)

mongoose.connect(url)


const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then(
    result => {
      result.forEach(person =>
        console.log(person)
      )
      mongoose.connection.close()
    }
  )
}


else {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number
  })
  person.save()
    .then(result => {
      console.log('person saved')
      mongoose.connection.close()
    })
}