const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const bucket = process.env.S3_BUCKET_NAME;
const filePath = './mock-data/ellen-ripley.jpg';

const params = {
    Bucket: bucket,
    Body : fs.createReadStream(filePath),
    Key : `${Date.now()}_${path.basename(filePath)}`
};

// s3.upload(params, (err, data) => {
//     if (err) console.log('Error', err);
//     if (data) console.log('Uploaded in:', data.Location);
// });

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Todo = require('./models/Todo');

async function runConnection () {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    app.listen(PORT, () => {
        console.log('connected to sandboxdb!');
        console.log(`Listening on ${ PORT }`);
    });
}

app.use('/api/*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    next();
});

app.get('/api/todos', (req, res) => {
    Todo.find({})
        .then(todos => res.send(todos))
        .catch(err => console.log(err));
});

app.post('/api/todos', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    new Todo({ text: req.body.text })
        .save()
        .then(todo => res.send(todo))
        .catch(err => console.log(err));
});

app.delete('/api/todos/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then(todo => res.send(todo))
        .catch(err => console.log(err));
});

app.put('/api/todos/:id', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    Todo.findOneAndUpdate({ _id: req.params.id }, { text: req.body.text }, { new: true })
        .then(todo => res.send(todo))
        .catch(err => console.log(err));
});

// app.get('/api/social-networks', (req, res) => {

// });

runConnection().catch(error => console.error(error.stack));
process.on('SIGINT', () => process.exit());