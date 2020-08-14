const dns = require('dns');
const URL = require('url').URL;

urlValidate = (url, cb) => {
  try {
    const hostname = new URL(url).hostname;
    console.log(hostname);
    dns.lookup(hostname, (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, url);
      }
    });
  } catch (err) {
    cb(err, null);
  }
};

exports.urlValidate = urlValidate;