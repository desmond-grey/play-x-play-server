const express = require('express');
const router = express.Router();

/* GET users listing. */
// noinspection JSUnusedLocalSymbols
router.get('/', function(req, res, next) {
  res.send({'status': 'healthy'});
});

module.exports = router;
