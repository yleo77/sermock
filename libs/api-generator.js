const express = require('express');

const PAGINATION = {
  size: 10,
  total: 100,
};

module.exports = function apiGenerator(db, name) {
  const router = express.Router();

  function list(req, res, next) {
    let resource = db.get(name);

    // parse page
    if (req.query._page) {
      let _page = parseInt(req.query._page, 10);
      let _size = parseInt(req.query._size, 10) || PAGINATION.size;
      let _totalPage = Math.ceil(resource.size() / _size);
      if (_page > _totalPage) {
        _page = 1;
      }
      let start = (_page - 1) * _size;
      let end = start + _size;
      resource = resource.slice(start, end);
    }
    res.locals.data = resource.value();
    next();
  }

  function create(req, res, next) {
    const resource = db.get(name).push(req.body).value();
    res.locals.data = resource;
    next();
  }

  function show(req, res, next) {
    const id = Number(req.params.id);
    const resource = db.get(name).find({ id: id }).value();
    res.locals.data = resource;
    next();
  }

  function update(req, res, next) {
    let id = Number(req.params.id);
    let o = Object.assign({}, req.body);
    o.id = id;
    const resource = db.get(name)
      .find({ id: id })
      .assign(o)
      .value();
    res.locals.data = resource;
    next();
  }

  function destroy(req, res, next) {
    // const id = Number(req.params.id);
    // let resource = db.get(name)
    //   .remove({ id: id })
    //   .value();
    const remain = db.get(name).value();
    res.locals.data = remain;
    next();
  }

  router.route('/')
    .get(list)
    .post(create);

  router.route('/:id')
    .get(show)
    .post(update)     // compatible with backend api
    .put(update)
    .delete(destroy);

  return router;
};
