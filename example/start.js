const path = require('path');
const mocker = require('sermock');

var config = require('./sermock.config.js');
config.db_file = path.resolve(__dirname, './sermock.db.json');

// app is an instance of express
const app = mocker.create(config);

mocker.start();
