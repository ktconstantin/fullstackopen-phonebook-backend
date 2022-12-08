const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')
const Person = require('./models/person')
const { update } = require('./models/person')

app.use(express.static('build'))
app.use(express.json())

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(cors())

let persons = [
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

// default path
app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

// info page
app.get('/api/info', (request, response) => {
  response.send(`
    <h4>Phonebook has info for ${persons.length} people</h4>
    <h4>${new Date()}</h4>
  `)
})

// get all persons
// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get single person by id
app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// delete person by id
app.delete('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// add new person
app.post('/api/persons', (request, response, next) => {
  const [body, name, number] = [
    request.body,
    request.body.name,
    request.body.number
  ]

  // if (!body) {
  //   return response.status(400).json({ 
  //     error: 'body missing' 
  //   })
  // } else if (!name) {
  //   return response.status(400).json({ 
  //     error: 'name missing' 
  //   })
  // } else if (!number) {
  //   return response.status(400).json({ 
  //     error: 'number missing' 
  //   })
  // }

  const names = persons.map(person => person.name.toLowerCase())

  if (names.includes(name.toLowerCase())) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name,
    number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

  // const newPerson = request.body
  // newPerson.id = createId()

  // persons = persons.concat(newPerson)

  // response.json(newPerson)
})

app.put('/api/persons/:id', (request, response, next) => {
  const [name, number] = [request.body.name, request.body.number]

  // const person = { 
  //   name, 
  //   number 
  // }

  // Person.findByIdAndUpdate(request.params.id, person, { new: true })
  //   .then(updatedPerson => {
  //     response.json(updatedPerson)
  //   })
  //   .catch(error => next(error))
  
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {next(error)})
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// returns int between 1 - 1000000
const createId = () => {
  return Math.floor((Math.random() * 1000000) + 1)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
