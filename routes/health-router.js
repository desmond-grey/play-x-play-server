const express = require('express');
const router = express.Router();

/* GET users listing. */
// noinspection JSUnusedLocalSymbols
router.get('/', function(req, res, next) {
  // todo: just a hardcoded mockup for now
  res.json({'status': 'healthy'});
});

module.exports = router;
