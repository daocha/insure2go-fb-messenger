'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

const access_token = "EAADW8EZCdlMIBAM6CDJhisahlKdRyRbAyuOpmkyqZAWil76F005OkMKa5e0auKu0sX7JXjVmxaBLfcYKT2kXkKCHCYYk0ZAjH4sP9GZCKIpYzBlZB5X8o4b7FHvC6NpbhvZAn4l82ZBaHghDfr9BRFQcoSea6TQNsULhRtCyTFm8gZDZD";

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    let reply;

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      let nlp = webhook_event.message.nlp;
      console.log("nlp="+JSON.stringify(nlp));
      let reply_text;
      const sentiment = firstEntity(nlp, "sentiment");
      const greeting = firstEntity(nlp, "greetings");
      const thanks = firstEntity(nlp, "thanks");
      const cfd = 0.6;
      if(sentiment && sentiment.value=="negative" && sentiment.confidence > cfd){
        reply_text = "T_T I'm sorry to hear that.";
      }else if(thanks && thanks.value=="true" && thanks.confidence > cfd){
        reply_text = ":) It's our pleasure!";
      }else if(greeting && greeting.value=="true" && greeting.confidence > cfd){
        reply_text = "Hello, may I help you?";
      }else if(sentiment && sentiment.value=="positive" && sentiment.confidence > cfd){
        reply_text = "^_^";
      }

      if(reply_text){
        let sender = webhook_event.sender;
        console.log("sender="+sender.id);
        reply = {
          "messaging_type": "RESPONSE",
          "recipient": sender,
          "message":{
            "text": reply_text
          }
        };
      }
    });

    if(reply){
      console.log("Sending reply: " + JSON.stringify(reply));
      // respond
      request({
        uri: "https://graph.facebook.com/v3.1/me/messages?access_token="+access_token,
        method: "POST",
        body: reply,
        json: true
      }, function(err, res, body){
        if(err != null){
          console.log(err);
        }else{
          console.log("Reply sent: "+JSON.stringify(body));
        }
      });
    }

    console.log("Responds 200...");
    // Returns a '200 OK' response to all requests
    res.status(200).send();
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "testtoken.sift.insure"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}
