// Include config and modules
const Webhook = require('./controllers/webhook.js');

// Routes
module.exports = function(app) {
  app.post('/webhook', Webhook.initChat);
};
