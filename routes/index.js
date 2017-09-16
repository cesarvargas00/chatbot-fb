var express = require('express');
var router = express.Router();

// Validation
router.get('/', function(req, res, next) {
  console.log(req.query);
  console.log(req.params);
  console.log(req.param);
	if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'goosfraba') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

//requests
router.post('/', function(req, res, next) {
  var data = req.body;
  console.log('anything!');
  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log('Webhook received unknown event: ', event);
        }
      });
    });
  }
  res.sendStatus(200);
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  var Slack = require('slack-node');
  var slack = new Slack();
  slack.setWebhook('https://hooks.slack.com/services/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');

  // slack emoji 
  slack.webhook({
    channel: '#suporte-site-criarme',
    username: 'criarmefb',
    icon_emoji: ':mega:',
    text: event.message
  }, function(err, response) {
    console.log(response);
  });
  console.log('Message data: ', event.message);
}

module.exports = router;
