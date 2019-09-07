const PORT = process.env.PORT || 5000;

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./db');

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/public'));

app.get('/api/users', (req, res) => {
    const content = fs.readFileSync('mock-data/users.json', 'utf8');
    res.send(JSON.parse(content));
});

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const content = fs.readFileSync('mock-data/users.json', 'utf8');
    const user = JSON.parse(content).find(el => el.id === parseInt(id, 10));

    user ? res.send(user) : res.status(404).send();
});

app.post('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { name, age } = { ...req.body };
    const user = { name, age };
    const data = fs.readFileSync('mock-data/users.json', 'utf8');
    const users = JSON.parse(data);

    const id = Math.max.apply(Math, users.map(el => el.id));
    user.id = id + 1;
    users.push(user);
    fs.writeFileSync('mock-data/users.json', JSON.stringify(users));
    res.send(user);
});

app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const data = fs.readFileSync('mock-data/users.json', 'utf8');
    const users = JSON.parse(data);
    const index = users.findIndex(el => el.id === parseInt(id, 10));

    if (index === -1) return res.status(404).send();

    const deletedUser = users.splice(index, 1)[0];
    fs.writeFileSync('mock-data/users.json', JSON.stringify(users));
    res.send(deletedUser);
});

app.put('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { id, name, age } = req.body;
    const data = fs.readFileSync('mock-data/users.json', 'utf8');
    const users = JSON.parse(data);
    const user = users.find(el => el.id === parseInt(id, 10));

    if (!user) return res.status(404).send(user);

    user.age = age;
    user.name = name;
    fs.writeFileSync('mock-data/users.json', JSON.stringify(users));
    res.send(user);
});

app.get('/api/social-networks', (req, res) => {
    res.send({
        confirmation: 'success',
        data: JSON.parse(fs.readFileSync('mock-data/social-networks.json', 'utf8')),
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
