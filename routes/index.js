const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
	return res.json({whatisthis: 'this is a json response'});
});

module.exports = router;
