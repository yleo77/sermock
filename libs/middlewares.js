const morgan = require('morgan');
const cors = require('cors');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');

function install(opts) {
  const ary = [];

  // log
  ary.push(morgan('dev'));
  // cors
  ary.push(cors({ origin: true, credentials: true }));
  // error handler
  ary.push(errorhandler());
  // body parse: application/json
  ary.push(bodyParser.json());
  // body parse: application/x-www-form-urlencoded
  ary.push(bodyParser.urlencoded({ extended: false }));

  if (opts.nocache) {
    ary.push(nocache);
  }

  ary.push(responseByQuery);
  return ary;
}

function responseByQuery(req, res, next) {
  if (req.query._res && req.query._res === '__REQ_QUERY__') {
    const o = Object.assign({}, req.query);
    delete o._res;
    res.jsonp(o);
    return;
  }
  next();
}

function nocache(req, res, next) {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

module.exports = install;
module.exports.responseByQuery = responseByQuery;
