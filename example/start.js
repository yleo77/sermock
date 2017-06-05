const mocker = require('sermock');

var config = require('./sermock.config.js');
config.db_file = './sermock.db.json';

// app is an instance of express
const app = mocker.create(config);

mocker.start();
