
## sermock

Another Server Mock for web develop using Node.js

## Why this one?

**Simple**

## Usage

```javascript
const mocker = require('sermock');

var config = {
  PORT: 3002,                     // PORT config, 3002 if you don't set
  nocache: false,                 // cache config
  static: ['./static'],           // static file dir
  apis: {
    '/bang': {                    // path
      'GET': {                    // Method and Response
        code: 0,
        msg: 'success'
      },
      'POST': '__REQ_QUERY__'     // Response the Querystring as JSON
    },
  },
  db_file: './sermock.1db.json',  // DB File Config
};

mocker.create(config);
mocker.start();
```

The Db file Config, just an example

```json
{
  "detail": {
    "id": 1,
    "title": "bala",
    "content": "Lorem ipsum dolor sit amet."
  },
  "list": [{
    "id": 1,
    "title": "bala"
  },{
    "id": 2,
    "title": "foo"
  }]
}
```

Then you can request these api:

* http://localhost:3002/detail (GET and POST)
* http://localhost:3002/list   (GET and POST)
* http://localhost:3002/list/1 (GET, PUT, DELETE, like Restful api)
* http://localhost:3002/bang

BTW, If you POST to `http://localhost:3002/bang?id=1&msg=cool` and you will get these response (as same as querystring).

```javascript
{id: 1, msg: 'cool'}
```

One more thing, If you put `_res=__REQ_QUERY__` as a querystring, then you have the same effect.




EOF







