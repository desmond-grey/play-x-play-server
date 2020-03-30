const express = require('express');
const router = express.Router();

const pingPongService = require('../lib/ping-pong-service');

// NOTE: all endpoint-paths below relative to /ping-pong (see app.js)

/* Start a game via POST  */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.post('/games/', function(req, res, next) {
    const gameStatus = pingPongService.startGame(req.body.tableId, req.body.players);
    res.json(gameStatus);
});


/* GET game state using gameId */
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.get('/games/:gameId', function(req, res, next) {
    let gameState = pingPongService.getGameState(req.params.gameId);

    if(gameState) {
        res.json(gameState);
    } else {
        res.status(404);
        res.send('No game with that ID');
    }
});


/*
    GET game state using tableId
    If no game is active for table, return 404
*/
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.get('/tables/:tableId/game', function(req, res, next) {
    let gameState = pingPongService.getGameStateForTableId(req.params.tableId);

    if(gameState) {
        res.json(gameState);
    } else {
        res.status(404);
        res.json({'errorMessage': 'No game active for table with that ID'});
    }
});


/*
    POST game events via gameId
    Sample event: {"eventType": "POINT_SCORED_BY_PLAYER", "playerId": "azul"}
*/
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.post('/games/:gameId/events', function(req, res, next) {
    if (req.body.eventType === 'POINT_SCORED_BY_PLAYER') {
        const gameStatus = pingPongService.scorePointForPlayer(req.params.gameId, req.body.playerId);
        res.json(gameStatus);
    } else {
        res.status(404);
        res.json({'errorMessage': 'Event type not supported'});
        console.error(`Event type not supported: ${req.body.eventType}`);
    }
});


/*
    POST game events via tableId
    Sample event: {"eventType": "POINT_SCORED_ON_TABLE", "tablePosition": 2}
*/
// noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
router.post('/tables/:tableId/events', function(req, res, next) {
    if (req.body.eventType === 'POINT_SCORED_ON_TABLE_AT_POSITION') {
        const gameStatus = pingPongService.scorePointAtTablePosition(req.params.tableId, req.body.tablePosition);
        res.json(gameStatus);
    } else {
        res.status(404);
        res.json({'errorMessage': 'Event type not supported'});
        console.error(`Event type not supported: ${req.body.eventType}`);
    }
});

module.exports = router;