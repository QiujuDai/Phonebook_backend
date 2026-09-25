const mongoose = require('mongoose')
require('dotenv').config()

// if(process.argv.length < 3 ){
//     console.log('give password, or password, name, and number as argument')
//     process.exit(1)
// }

const url = process.env.MONGOOSE_URL

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    // console.log(result)
    console.log('connected to MongoDB')})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        const splittedPart = v.split('-')
        return ((splittedPart.length === 2) &&
                       (splittedPart[0].length >= 2) &&
                       (splittedPart[0].length <= 3) &&
                       (splittedPart[1].length > 0) &&
                       ((splittedPart[0].length) + splittedPart[1].length) >=8)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)