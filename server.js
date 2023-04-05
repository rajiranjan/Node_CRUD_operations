const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();


// Make sure you place body-parser before your CRUD handlers!



MongoClient.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1', { useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database');
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')


    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))


    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(/* ... */)
    })


    app.post('/quotes', (req, res) => {
  quotesCollection.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(error))
})


app.put('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;
  quotesCollection.findOneAndUpdate(
    { _id: ObjectId(quoteId) },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      upsert: true
    }
  )
  .then(result => res.json('Success'))
  .catch(error => console.error(error))
})

app.delete('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;
  quotesCollection.deleteOne( { _id: ObjectId(quoteId) })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.json('No quote to delete')
      }
      res.json(`Deleted quote with ID ${quoteId}`)
    })
    .catch(error => console.error(error))
})

    app.listen(3000,() =>{console.log('listening on 3000')
    })
  })
  .catch(console.error);
