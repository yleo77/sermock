const express = require('express');
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

  if (opts.rewrite && opts.rewrite.length) {
    ary.push(rewrite(opts));
  }

  ary.push(responseByQuery);
  return ary;
}

function responseByQuery(req, res, next) {
  if (req.query._statusCode) {
    let code = parseInt(req.query._statusCode, 10);
    res.status(code).send('Response with the status code in querystring');
    return;
  }

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

function rewrite(config) {
  var router = express.Router();
  // console.log('url rewrite config: ');
  // console.log(config.rewrite);
  config.rewrite.forEach(function(rule) {
    const route = rule.pattern +
      (rule.pattern[rule.pattern.length - 1] === '/' ? '*' : '/*');
    router.all(route, function (req, res, next) {
      console.log('before: ' + req.url);
      req.url = req.url.replace(rule.pattern, rule.responder);
      // TODO: process query
      next();
    });
  });
  return router;
}

module.exports = install;
module.exports.responseByQuery = responseByQuery;
