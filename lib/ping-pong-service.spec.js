const
    _ = require('lodash'),
    expect = require('chai').expect;

const pingPongService = require('./ping-pong-service');

// handy IDs for the tests below
const tableId = 'a8f8hb3a-aae9-4c12-808c-b3603c5hh887';
const playerOneId = 'a768fb3a-aae9-4c12-808c-b3603c5aa799';
const playerTwoId = 'ed70d277-1648-407a-ab93-da146e834b5e';


// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe('start game', function () {
    // noinspection JSUnresolvedFunction
    it('should create new game successfully', function () {
        const gameState = pingPongService.startGame(
            tableId,
            [
                playerOneId,
                playerTwoId
            ]
        );

        expect(gameState).to.exist;
        // todo: more asserts
    });

    // todo: for now, should error when creating new game with <> 2 players
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe('score point for player', function () {
    const tableId = 'a8f8hb3a-aae9-4c12-808c-b3603c5hh887';
    const playerOneId = 'a768fb3a-aae9-4c12-808c-b3603c5aa799';
    const playerTwoId = 'ed70d277-1648-407a-ab93-da146e834b5e';

    // noinspection JSUnresolvedFunction
    it('should score points successfully', function () {
        const gameStateBeforePointScored = pingPongService.startGame(
            tableId,
            [
                playerOneId,
                playerTwoId
            ]
        );

        pingPongService.scorePointForPlayer(gameStateBeforePointScored.gameId, playerTwoId);     // we ignore the gameState response here, we don't want to check point totals yet
        const gameStateAfterPointsScored = pingPongService.scorePointForPlayer(gameStateBeforePointScored.gameId, playerTwoId);
        const playerTwoState = getPlayerState(gameStateAfterPointsScored.players, playerTwoId);
        expect(playerTwoState.pointsScored === 2);
    });
});

describe('score point at table position', function () {
    const tableId = 'a8f8hb3a-aae9-4c12-808c-b3603c5hh887';
    const playerOneId = 'a768fb3a-aae9-4c12-808c-b3603c5aa799';
    const playerTwoId = 'ed70d277-1648-407a-ab93-da146e834b5e';

    // noinspection JSUnresolvedFunction
    it('should score points successfully', function () {
        pingPongService.startGame(
            tableId,
            [
                playerOneId,
                playerTwoId
            ]
        );

        pingPongService.scorePointAtTablePosition(tableId, 2);     // we ignore the gameState response here, we don't want to check point totals yet
        const gameStateAfterPointsScored = pingPongService.scorePointAtTablePosition(tableId, 2);
        const playerTwoState = getPlayerState(gameStateAfterPointsScored.players, playerTwoId);
        expect(playerTwoState.pointsScored === 2);
    });
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe('switch serve', function () {
    // Note: for coding convenience, gameState is overwritten again and again in the tests below.  Caution is advised.
    let gameState = pingPongService.startGame(
        tableId,
        [
            playerOneId,
            playerTwoId
        ]
    );

    // who got the initial serve?  (it's determined randomly at game start)
    const playerIdWithInitialServe = getPlayerState(gameState.players, playerOneId).hasServe ? playerOneId : playerTwoId;
    const playerIdWithoutInitialServe = getPlayerState(gameState.players, playerOneId).hasServe ? playerTwoId : playerOneId;

    // noinspection JSUnresolvedFunction
    it('should switch serve after 2 points', function () {
        // score the first point, serve doesn't change yet
        gameState = pingPongService.scorePointForPlayer(gameState.gameId, playerOneId);
        expect(getPlayerState(gameState.players, playerIdWithInitialServe).hasServe).to.be.true;

        // score a second point, serve should swap now
        gameState = pingPongService.scorePointForPlayer(gameState.gameId, playerTwoId);
        expect(getPlayerState(gameState.players, playerIdWithoutInitialServe).hasServe).to.be.true;
    });

    // noinspection JSUnresolvedFunction
    it('should switch serve after every point if either point-score is > 11', function () {
        // after each player scores 10 points, the serve should be back with the initial server
        for (let i = 0; i <= 10; i++) {
            gameState = pingPongService.scorePointForPlayer(gameState.gameId, playerOneId);
            gameState = pingPongService.scorePointForPlayer(gameState.gameId, playerTwoId);
        }
        expect(getPlayerState(gameState.players, playerIdWithInitialServe).hasServe).to.be.true;


    });

});


// ----- private -----

function getPlayerState(playerList, playerId) {
    return _.find(playerList, ['id', playerId]);
}