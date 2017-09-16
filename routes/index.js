var express = require('express');
var router = express.Router();
var request = require('request');

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
  
  //get full name of sender
  let sender_id = event.sender.id;
  let page_access_token = 'EAAbYarPCJHsBAOmvH8dWjTFPOZB5qfgxvyKMF7ZBhtA3QeOb48hB3hNMwS9e5yaEs2SOI0NZAyd0NzEkmGvZC5q6rrPgBZAXvvP6AZCIjmDxZCqIfTFGCiKCs44JCEAEGVhjHlO5399hDHrcCOZCAGFSF89FK8Y2u04uy5dymVnBQgZDZD';

  if (event.message.is_echo){
    sendToSlack('Criar.me', 'https://scontent.fcgh2-1.fna.fbcdn.net/v/t1.0-1/p64x64/14908238_1330418523675276_394637248400955542_n.jpg?oh=9dac39d7b958fa6f13868301398c13dd&oe=5A46E4C1', event.message.text);
  } else {
    request(`https://graph.facebook.com/v2.6/${sender_id}?fields=first_name,last_name,profile_pic&access_token=${page_access_token}`, function (error, response, body) {
      let parsed_body = JSON.parse(body);
      sendToSlack(`${parsed_body.first_name} ${parsed_body.last_name}`, parsed_body.profile_pic, event.message.text);
    });
  }
  

}

function sendToSlack(username, icon, text) {
  var Slack = require('slack-node');
  var slack = new Slack();
  slack.setWebhook('https://hooks.slack.com/services/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');
  slack.webhook({
      channel: '#suporte-site-criarme',
      username: username,
      icon_emoji: icon,
      text: text
    }, function(err, response) {
      if (err) console.log('error sending to slack:', err);
      else console.log('sent to slack!');
    });
}

module.exports = router;
