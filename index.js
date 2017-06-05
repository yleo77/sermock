const express = require('express');
const low = require('lowdb');
const fileSync = require('lowdb/lib/storages/file-sync');

const middlewares = require('./libs/middlewares.js');
const apiGenerator = require('./libs/api-generator.js');
const defaults = require('./libs/config.js');

const app = express();
app.use(middlewares());

let config = {};

module.exports = {

  express: express,

  create: function create(opts) {
    if (opts) {
      config = Object.assign({}, defaults, opts);
    }

    // static 目录存在的话
    if (config.static.length) {
      config.static.forEach((dir) => {
        app.use(express.static(dir));
      });
    }

    // apis 配置如果存在的话
    Object.keys(config.apis).forEach((api) => {
      app.use(api, function middleware(req, res, next) {
        const o = config.apis[api];
        let response;
        if (o[req.method]) {
          if (o[req.method] === '__REQ_QUERY__') {
            response = req.query;
          } else {
            response = o[req.method];
          }
        } else {
          response = { code: 0, msg: '' };
        }
        res.locals.data = response;
        next();
      });
    });

    if (config.db) {
      const db = low(config.db, {
        storage: {
          read: fileSync.read,
        },
      });

      db.forEach((value, key) => {
        if (Array.isArray(value)) { // list, detail
          app.use(`/${key}`, apiGenerator(db, key));
        } else { // object, str? 直接返回
          app.use(`/${key}`, function middleware(req, res) {
            res.locals.data = value;
          });
        }
      }).value();
    }

    app.use(function middleware(req, res) {
      if (!res.locals.data) {
        res.status(404);
        res.locals.data = {};
        res.send('Not Found');
        return;
      }
      res.jsonp(res.locals.data);
    });

    return app;
  },
  start: function start() {
    app.listen(config.PORT, () => {
      console.log(`mock server is running at ${config.PORT}`);
    });
  },
};
