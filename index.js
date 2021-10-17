const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))


let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    },
]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})


app.get('/info', (req, res) => {
    const time = new Date().toString()
    const x = persons.length  
    
    res.send(`phonebook has info for ${x} people <p> ${time}`)
})


app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)  
    
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((!body.name) || (!body.number)) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  
  const nameTaken = persons
                    .map(person => person.name)
                    .includes(body.name)

  if (nameTaken) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })  
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
    
  }
    
  persons = persons.concat(person)
  response.json(person)
})


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})