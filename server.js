const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const app = express();
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected!');
});

app.get('/api/social-networks', (req, res) => {
  const content = fs.readFileSync('src/data/social-data.json', 'utf8');
  const users = JSON.parse(content);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.send(users);
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
