const dns = require('dns');
const URL = require('url').URL;

urlValidate = (url, cb) => {
  // Parse the URL for the hostname and validate that it resolves to an IP
  try {
    const hostname = new URL(url).hostname;
    dns.lookup(hostname, (err) => {
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