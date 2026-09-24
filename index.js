const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return req.method ==='POST' ? JSON.stringify(req.body) : ''})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const getId = () => {
    const maxLen = persons.length >0 ? Math.max(... persons.map(p => Number(p.id))) : 0
    return String(maxLen + 1)
}

app.get('/api/persons', (request, response) => {
    Person.find({})
    .then(persons => {
       if(persons && persons.length > 0){
            return response.json(persons)        
        }
        else{
            return response.status(404).end()
        } 
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then(person => {
        if(!person){
            response.status(404).end()
        } else{
            response.json(person)
        }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) =>{
    Person.find({}).then(persons => {
        const lenght = persons.length
        const timeStamp = new Date()
        console.log(timeStamp)
        response.send(`<p>Phonebook has info for ${lenght} people</p> 
            <p>${timeStamp} </p>`)
    })
    
     
})

app.post('/api/persons/', (request, response, next) =>{
    const body = request.body
    const name = body.name
    const number = body.number
    const newPerson = new Person({
        name: name,
        number: number
    })
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
})

// app.put('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     const {name, number} = request.body
//     Person.findById(id).then(person => {
//         if(!person){
//             response.status(404).end()
//         }
//         person.name = name
//         person.number = number
//         return person.save().then(updatedPerson => {
//             response.json(updatedPerson)
//         })    
//     })
//     .catch(error => next(error))
// })

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const {name, number} = request.body
    const updatedPerson = {"name": name, "number": number}
    const opts = {runValidators: true}
    if(name && number){
        Person.findByIdAndUpdate(id, updatedPerson, opts).then(findPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    if(error.name === 'CastError'){
       response.status(404).send({error: 'malformatted id'})
    }
    else if(error.name == 'ValidationError'){
        response.status(400).json({error: error.message})
    }
    else{
        next(error)
    }
    
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

