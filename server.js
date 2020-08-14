'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const urlValidate = require('./urlValidate').urlValidate;
const findById = require('./dbFunctions').findById;
const createAndSaveURL = require('./dbFunctions').createAndSaveURL;

// Establish connection to MongoDB
require('./dbFunctions').connect(process.env.MONGO_URI);

// log all requests to console
app.use((req, res, next) => {
  console.log(`${Date.now()}: ${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use(cors());

// Add body-parser to parse POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// serve the public static files and index.html
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', (req, res) => {
  res.json({greeting: 'hello API'});
});

// Create a new shortened URL
const errorResponse = {'error': 'invalid URL'};

app.post('/api/shorturl/new', (req, res) => {
  const URL = req.body['url'];

  urlValidate(URL, (err, validURL) => {
    if (err) {
      res.json(errorResponse);
    } else {
      // Call mongo to save and get a value
      createAndSaveURL(validURL, (err, data) => {
        if (err) {
          res.json({'error': `DB error: ${err}`});
        } else {
          res.json({'original_url': data['url'], 'short_url': data['id']});
        }
      });
    }
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  // Convert id to a number
  const urlID = +req.params['id'];
  if (Number.isNaN(urlID)) {
    res.json(errorResponse);
  } else {
    findById(urlID, (err, data) => {
      if (err) {
        res.json({'error': `DB error: ${err}`});
      } else {
        res.redirect(data.url);
      }
    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Node.js is listening on port ' + listener.address().port);
});