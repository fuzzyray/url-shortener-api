'use strict';

require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const urlValidate = require('./urlValidate').urlValidate;

// log all requests to console
app.use((req, res, next) => {
  console.log(`${Date.now()}: ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Connect to Mongo
mongoose.connect(process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());

// Add body-parser to parse POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', (req, res) => {
  res.json({greeting: 'hello API'});
});

//
app.post('/api/shorturl/new', (req, res) => {
  const URL = req.body['url'];
  const errorResponse = {'error': 'invalid URL'};

  urlValidate(URL, (err, validURL) => {
    if (err) {
      res.json(errorResponse);
    } else {
      res.json({'requested': validURL});
    }
  });
});

app.get('/api/shorturl/:id', (req, res, next) => {
  // Convert id to a number
  const urlID = +req.params['id'];
  if (Number.isNaN(urlID)) {
    res.json({'error': `Invalid URL id: ${req.params['id']}`});
    return;
  }
  // Some db magic to get URL
  //res.redirect(url)
  res.json({'requested': req.params['id']});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Node.js listening ...');
  // save myself some typing
  console.log('http://localhost:' + listener.address().port);
});