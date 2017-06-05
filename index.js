const fs = require('fs');
// const path = require('path');
const express = require('express');
const low = require('lowdb');
const fileSync = require('lowdb/lib/storages/file-sync');

const middlewares = require('./libs/middlewares.js');
const apiGenerator = require('./libs/api-generator.js');
const defaults = require('./libs/config.js');

const app = express();
console.log();
let config = {};

module.exports = {

  express: express,

  create: function create(opts) {
    if (opts) {
      config = Object.assign({}, defaults, opts);
    }
    app.use(middlewares(config));

    // static dir config
    if (config.static.length) {
      config.static.forEach((dir) => {
        app.use(express.static(dir));
      });
    }

    // apis config
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

    if (config.db_file) {
      // config.db = path.resolve(config.db);
      const isexist = fs.existsSync(config.db_file);
      if (!isexist) {
        console.log(`Warning: db file ${config.db_file} doesn't exist.`);
      } else {
        const db = low(config.db_file, {
          storage: {
            read: fileSync.read,
          },
        });

        db.forEach((value, key) => {
          if (Array.isArray(value)) { // list, detail
            app.use(`/${key}`, apiGenerator(db, key));
          } else { // object, str?
            app.use(`/${key}`, function middleware(req, res, next) {
              res.locals.data = value;
              next();
            });
          }
        }).value();
      }
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
