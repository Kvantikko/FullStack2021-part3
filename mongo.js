const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

let initialPassword = process.argv[2]

// jos salasanassa seuraavat merkinnät[     : / ? # [ ] @     ], ongelmia!
if (initialPassword.includes('@')) {
    initialPassword = initialPassword.replace(/@/g, '%40');
}

const password = initialPassword

const url =
    `mongodb+srv://fullstackmikko:${password}@cluster0.mmjrx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// jos annetaan vaan salasana eikä salasanan jälkeen ole lisättävää henkilöä, tulostetaan tietokannassa olevat numerot, muuten lisätään uusi henkilö
if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
             console.log(person.name, person.number)
             mongoose.connection.close()
        })
    })
    setTimeout(function() {process.exit(1)}, 2000)
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)
        mongoose.connection.close()
    })
}


