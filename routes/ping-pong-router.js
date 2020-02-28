const express = require('express');
const router = express.Router();

const pingPongService = require('../lib/ping-pong-service');

// all endpoint-paths below relative to /ping-pong (see app.js)


/* GET users listing. */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.get('/game/:gameId', function(req, res, next) {
    let gameState = pingPongService.getGameState(req.params.gameId);

    if(gameState) {
        res.json(gameState);
    } else {
        res.status(404);
        res.send('No game with that ID');
    }
});

/* GET users listing. */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.post('/game/', function(req, res, next) {
    const gameStatus = pingPongService.startGame(req.body.tableId, req.body.players);
    res.json(gameStatus);
});


module.exports = router;