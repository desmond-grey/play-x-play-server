const express = require('express');
const router = express.Router();

const pingPongService = require('../lib/ping-pong-service');

// all endpoint-paths below relative to /ping-pong (see app.js)


/* GET users listing. */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.get('/game', function(req, res, next) {
  // todo: just a mockup
  // todo: this would be for an active game.  What happens if you GET an inactive game ID?
  res.json([
        {
          id: 'a768fb3a-aae9-4c12-808c-b3603c5aa799',
          points_scored: 0,
          has_serve: false,
          side: 0         // which side of the table the payer is standing on.  0 or 1
        },
        {
          id: 'ed70d277-1648-407a-ab93-da146e834b5e',
          points_scored: 0,
          has_serve: true,
          side: 1
        }
  ]);
});

/* GET users listing. */
// noinspection JSUnusedLocalSymbols
router.post('/game/', function(req, res, next) {
    const gameStatus = pingPongService.startGame(req.body.tableId, req.body.players);
    res.json(gameStatus);
});


// todo: can I move this near the top of the code?  I'm used to it there
module.exports = router;
