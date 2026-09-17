const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return req.method ==='POST' ? JSON.stringify(req.body) : ''})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const getId = () => {
    const maxLen = persons.length >0 ? Math.max(... persons.map(p => Number(p.id))) : 0
    return String(maxLen + 1)
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    if(persons && persons.length > 0){
        return response.json(persons)        
    }
    else{
        return response.status(404).end()
    }
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id==id)
    if(person){
        return response.json(person)        
    }
    else{
        return response.status(404).end()
    }
})

app.get('/info', (request, response) =>{
    const lenght = persons.length
    const timeStamp = new Date()
    console.log(timeStamp)
    response.send(`<p>Phonebook has info for ${lenght} people</p> 
        <p>${timeStamp} </p>`)
     
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    const name = body.name
    const number = body.number
    const isNameDup = persons.some(p => p.name==name)
    const isNameMissing = !name || !name.trim()
    const isNumberMissing = !number || !number.trim()
    console.log(`isNameMissing:${isNameMissing}, isNumberMissing: ${isNumberMissing}, isNameDup: ${isNameDup}`)
    
    if(isNameDup || isNameMissing || isNumberMissing){
        response.status(400).json({error: 'name must be unique'})
    }
    else{
        const id = getId()
        // body.id = id;
        const newPerson = {
            id: id,
            name: body.name,
            number: body.number
        }
        persons = persons.concat(newPerson)        
        response.json(newPerson)
    }    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

