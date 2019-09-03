require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./db');

app.use(bodyParser.json());

app.get('/api/todo', async (req, res) => {
    await db.collection('inventory').insertOne({
        item: 'canvas',
        qty: 100,
        tags: ['cotton'],
        size: { h: 28, w: 35.5, uom: 'cm' }
    });

    db.collection('inventory').findOne({item: 'canvas'}, function(err, user) {
        if (err) return console.log(err);
        const answer = { ...user, port: process.env.PORT, dbConnection: process.env.MONGODB_URI };
        res.send(answer);
    });
});

app.get('/api/social-networks', (req, res) => {
    const users = 'users';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    res.json({
        confirmation: 'success',
        data: [{
            "id":1,
            "name":"LinkedIn",
            "link":"https://www.linkedin.com/in/denis-kalenik-3948a8a7/"
        }, {
            "id":2,
            "name":"vk.com",
            "link":"https://vk.com/j.smith8"
        }, {
            "id":3,
            "name":"Instagram",
            "link":"https://www.instagram.com/j.o.h.n.smith/"
        }],
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
