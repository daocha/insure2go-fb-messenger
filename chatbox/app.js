'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'); // creates express http server

// Include Configuration
var config_initialize = require('./config');

config_initialize((config) => {
  var app = express();
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Load app routes
  require('./routes')(app);

  // Sets server port and logs message on success
  app.listen(config.LISTEN_PORT, () => console.log('webhook is listening'));

});
