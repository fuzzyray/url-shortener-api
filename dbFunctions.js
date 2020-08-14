const mongoose = require('mongoose');

// Current Max ID value
let currentId;

const shortUrlSchema = new mongoose.Schema({
  id: {type: Number, required: true},
  url: {type: String, required: true},
});
const ShortURL = mongoose.model('ShortURL', shortUrlSchema);

// Create
const createAndSaveURL = (url, cb) => {
  const newURL = new ShortURL({id: currentId, url: url});
  findByUrl(url, (err, data) => {
    if (err) {
      cb(err, null);
    } else if (data) {
      cb(null, data);
    } else {
      newURL.save((err, data) => {
        if (err) {
          cb(err, null);
        } else {
          currentId++;
          console.log(`currentID: ${currentId}`);
          cb(null, data);
        }
      });
    }
  });
};

// Read Functions
const findById = (id, cb) => {
  ShortURL.find({id: id}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data[0]);
    }
  });
};

const findByUrl = (url, cb) => {
  ShortURL.find({url: url}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data[0]);
    }
  });
};

// Update (Not used by the API service)
const findAndUpdateById = (id, url, cb) => {
  ShortURL.findOneAndUpdate({id: id}, {url: url}, {new: true}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

// Delete (Not used by the API service
const deleteById = (id, cb) => {
  ShortURL.findOneAndDelete({id: id}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

// Connect to Mongo and find our highest ID
const connect = (dbURI) => {
  mongoose.connect(dbURI,
      {useNewUrlParser: true, useUnifiedTopology: true});
  ShortURL.find()
      .sort({id: 'ascending'})
      .exec((err, data) => {
        if (err) {
          console.error(err);
        } else if (data.length) {
          currentId = data[data.length - 1].id + 1;
        } else {
          currentId = 1;
        }
        console.log(`currentID: ${currentId}`);
      });
};

exports.connect = connect;
exports.createAndSaveURL = createAndSaveURL;
exports.findById = findById;
exports.findByUrl = findByUrl;
exports.findAndUpdateById = findAndUpdateById;
exports.deleteById = deleteById;