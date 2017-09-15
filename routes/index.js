const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
	var data = req.body;

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

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
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
