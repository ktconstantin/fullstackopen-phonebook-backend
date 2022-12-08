const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = 
  `mongodb+srv://kconstantin:${password}@phonebook.8vrwfkn.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( false ) {
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log('connected')
//     console.log('name', process.argv[3])
//     console.log('number', process.argv[4])

//     const person = new Person({
//       name: process.argv[3],
//       number: process.argv[4]
//     })

//     // console.log(`Added ${person.name} number ${person.number} to phonebook`)

//     console.log(person)

//     // Person.find({}).then(result => {
//     //   result.forEach(person => {
//     //     console.log(person)
//     //   })
//     //   mongoose.connection.close()
//     // })

//     return person.save()
//   })
//   .then(() => {
//     console.log(`Added ${person.name} number ${person.number} to phonebook`)

//     return mongoose.connection.close()
//   })
//   .catch((err) => console.log(err))
