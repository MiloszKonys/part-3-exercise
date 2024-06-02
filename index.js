const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static('dist'))
const Person = require('./models/person')

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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/info", (req, res, next) => {
  Person.estimatedDocumentCount({})
    .then((count) => {
      const message =
        `<p>Phonebook has info for ${count} people</p>` +
        `<p>${new Date()}</p>`;
      res.send(message);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // Check for duplicate name in the database
  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'Name must be unique'
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch(error => next(error))
    }
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
