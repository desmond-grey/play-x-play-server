const express = require('express');
const router = express.Router();

const pingPongService = require('../lib/ping-pong-service');

// all endpoint-paths below relative to /ping-pong (see app.js)


/* GET users listing. */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.get('/game/:gameId', function(req, res, next) {
    let gameState = pingPongService.getGameState(req.params.gameId);

    if(gameState) {
        return gameState
    } else {
        res.status(404);
        throw new Error('No game with that ID')
    }
});

/* GET users listing. */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.post('/game/', function(req, res, next) {
    const gameStatus = pingPongService.startGame(req.body.tableId, req.body.players);
    res.json(gameStatus);
});


// todo: can I move this near the top of the code?  I'm used to it there
module.exports = router;
