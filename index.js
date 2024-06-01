const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

morgan.token('req-body',(req)=>{
  if(req.method==='POST'){
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

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


function countPersons(persons) {
  return persons.length;
}

const count = countPersons(persons);

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response, next) => {
  const message =
  `<p>Phonebook has info for ${count} people</p>` +
  `<p>${new Date()}</p>`;
    response.send(message);
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  const duplicateName = persons.find(p => p.name === body.name);
  if (duplicateName) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }


  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('x')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})