const
    express = require('express'),
    packageJson = require('../package');

const router = express.Router();

// GET version.  Relative to /version
// noinspection JSUnusedLocalSymbols
router.get('/', function(req, res, next) {
  res.json({'version': packageJson.version});
});

module.exports = router;