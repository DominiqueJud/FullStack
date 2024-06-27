const MONGODB_URL = process.env.MONGODB_URL
const mongoose = require('mongoose')

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (value) => {
        return /^\d{2,3}[-]d*/.test(value)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone Number required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

mongoose.set('strictQuery', false)

console.log('connecting to MongoDB')
mongoose.connect(MONGODB_URL)
  .then(result => {
    console.log('connection to MongoDB established')
  })
  .catch(error => {
    console.log('error connectiong to MongoDB', error.message)
  })


module.exports = mongoose.model('Person', personSchema)