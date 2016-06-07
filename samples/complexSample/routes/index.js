var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Sample Header',
    body: 'sample panel body content'
  });
});

module.exports = router;
