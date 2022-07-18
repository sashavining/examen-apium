if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const axios = require('axios')
const ObjectId = require('mongodb').ObjectId;


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const MongoClient = require('mongodb').MongoClient

MongoClient.connect(process.env.MONGO_CONNECTION_STRING, { useUnifiedTopology: true })
.then(client => {
  const db = client.db('examen-apium');

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
    })

   app.get('/gameboards/newest', async (req, res) => {
        db.collection('game-boards').find().sort({"_id": -1}).limit(1).toArray()
            .then(results => {
                res.send(JSON.stringify(results))
            })
            .catch (error => console.log(error))   
    });

    app.put('/gameboards/:id', async (req, res) => {
        try {
            const response = await axios.get(`https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${req.body.word}`)
            if ((Object.keys(response.data.RDF.Annotation)).includes("hasBody")) {
                db.collection('game-boards').findOneAndUpdate(
                    { _id: ObjectId(req.params.id) },
                    {
                        $set: { 
                            ["solutions." + req.body.word] : req.body.score,

                        },
                        $inc: {
                            totalPoints : req.body.score
                        }
                    }, (err, doc) => {
                        if (err) return res.send(500, {error: err});
                        return doc;                      
                    }
                    )
            }
            res.sendStatus(200)
        }
        catch (error) {
            console.log(error);
            res.sendStatus(404)
        }    
    })

    app.put('/dictionary', async (req, res) => {
        try {
            const response = await axios.get(`https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${req.body.word}`)
            if ((Object.keys(response.data.RDF.Annotation)).includes("hasBody")) {
                db.collection('latin-words').findOneAndUpdate(
                    { },
                    {
                        $push: { 
                            "words" : req.body.word,
                        }
                    }, (err, doc) => {
                        if (err) return res.send(500, {error: err});
                        return doc;                      
                    }
                    )
            }
            res.sendStatus(200)
        }
        catch (error) {
            console.log(error);
            res.sendStatus(404)
        }    
    })
    app.listen(process.env.PORT || 3000)

})


