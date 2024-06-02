const mongoose = require('mongoose')

if (
    process.argv.length < 3 ||
    (process.argv.length > 3 && process.argv.length < 5)
  ) {
    console.log(`USAGE: node mongo.js password name number`);
    process.exit(1);
  }

  const { 2: password, 3: name, 4: number } = process.argv

const url = `mongodb+srv://vaceso9001:${password}@cluster0.zpxsrkz.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema, "persons")

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((p) => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}
