const
    _ = require('lodash'),
    uuid = require('uuid/v4');

module.exports = {
    startGame,
    scorePointForPlayer,
    scorePointAtTablePosition,
    getGameState
};

const activeGames = new Map();
const activeTables = new Map();

function startGame(tableId, playerIds) {
    if (playerIds.length !== 2) throw new Error("Only two players allowed");

    const gameId = uuid();

    const playerWithServe = Math.random() < 0.5 ? playerIds[0] : playerIds[1];    // initial server is chosen randomly
    const newGame = {
        gameId: gameId,
        tableId: tableId,       // the table the game is being played on
        gameStartEpochMillis: Date.now(),
        gameEndEpochMillis: null,
        gameStatus: 'ACTIVE',       // PENDING | ACTIVE | COMPLETE
        players: [
            {
                id: playerIds[0],
                tablePosition: 1,         // which side of the table the player is standing on.  0 or 1       // todo user should be able ot pick sides
                pointsScored: 0,
                hasServe: playerWithServe === playerIds[0]
            },
            {
                id: playerIds[1],
                tablePosition: 2,
                pointsScored: 0,
                hasServe: playerWithServe === playerIds[1]
            }
        ]
    };

    activeGames.set(gameId, newGame);
    activeTables.set(tableId, gameId);

    return newGame;
}

function scorePointForPlayer(gameId, playerId) {
    const gameState = activeGames.get(gameId);       // todo: handle can't find game
    let playerRecord = _.find(gameState.players, ['id', playerId]);      // todo: handle can't find player

    playerRecord.pointsScored ++;       // todo: check if this causes a game win

    swapServeAfterPointScoredIfNecessary(gameState, playerId);

    return gameState;
}

function scorePointAtTablePosition(tableId, tablePosition) {
    const gameId = activeTables.get(tableId);       // todo: handle can't find gameId via tableId
    const gameState = activeGames.get(gameId);       // todo: handle can't find game

    let playerRecord = _.find(gameState.players, ['tablePosition', tablePosition]);      // todo: handle can't find tablePosition

    playerRecord.pointsScored ++;       // todo: check if this causes a game win

    swapServeAfterPointScoredIfNecessary(gameState, playerRecord.id);

    return gameState;
}

function getGameState(gameId) {
    return activeGames.get(gameId);
}


// ----- private -----

// this should only be called after a point has just been scored
function swapServeAfterPointScoredIfNecessary(gameId) {
    // todo: if score is above ?? then serve swaps every point
    if(getRawPointsScored(gameId))      // **** todo: use a contains here to see if any are 11 or above?

    // serve swaps every two points (which is to say, when the total points are even)
    if(getTotalPoints(gameId) % 2 === 0) {
        swapServeForTwoPLayerGame(gameId.players);
    }
}

// a lodash "find by property value" would probably eliminate the need for the sub-functions
// todo: expand to support 4 player games also
function swapServeForTwoPLayerGame(players) {
    const playerStateForPlayerWithServe = getPlayerStatusForPlayerWithServe(players);
    const playerStateForPlayerWithoutServe = getPlayerStatusForPlayerWithoutServe(players);

    playerStateForPlayerWithServe.hasServe = false;
    playerStateForPlayerWithoutServe.hasServe = true;
}

// assumes one, and only one player, ever has the serve
function getPlayerStatusForPlayerWithServe(players) {
    for (const playerState of players) {
        if (playerState.hasServe) {
            return playerState;
        }
    }
}

// todo: support 4 player game
// assumes one, and only one, player ever has the serve
function getPlayerStatusForPlayerWithoutServe(players) {
    for (const playerState of players) {
        if (! playerState.hasServe) {
            return playerState;
        }
    }
}

// no playerIds associated with this score, just the raw points
function getRawPointsScored(gameId) {
    return gameId.players.map(playerState => {
        return playerState.pointsScored;
    })
}

// todo: the "reduce" idiom might look cleaner for this
function getTotalPoints(gameId) {
    let totalPoints = 0;

    for (const playerState of gameId.players) {
        totalPoints += playerState.pointsScored
    }

    return totalPoints;
}