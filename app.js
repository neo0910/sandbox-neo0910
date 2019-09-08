const PORT = process.env.PORT || 5000;

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

app.get('/api/social-networks', (req, res) => {
    
});

runConnection().catch(error => console.error(error.stack));
process.on('SIGINT', () => process.exit());