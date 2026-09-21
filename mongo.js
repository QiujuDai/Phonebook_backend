const mongoose = require('mongoose')

if(process.argv.length < 3 ){
    console.log('give password, or password, name, and number as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.elsq0lv.mongodb.net/PersonApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family: 4})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length == 5){
    const note = Person({
    name: process.argv[3],
    number: process.argv[4],
    })
    note.save().then(result => {
        console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}
else{
    Person.find({})
    .then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
