if (!global.Promise) {
    global.Promise = Promise;
}

const
    chai = require('chai'),
    expect = require('chai').expect,
    chaiHttp = require('chai-http'),
    app = require('../../app'),
    packageJson = require('../../package');


// handy IDs for the tests below
const tableId = 'a8f8hb3a-aae9-4c12-808c-b3603c5hh887';
const playerOneId = 'a768fb3a-aae9-4c12-808c-b3603c5aa799';
const playerTwoId = 'ed70d277-1648-407a-ab93-da146e834b5e';

// Configure chai
chai.use(chaiHttp);
chai.should();

// The central/shared ping pong game use by most tests.  created in "before" function
let sharedPingPongGameId;   // assigned during game create

// noinspection NodeModulesDependencies,ES6ModulesDependencies,JSUnresolvedFunction
beforeEach(function (done) {
    chai.request(app)
        .post('/ping-pong/games')
        .send({
            'tableId': tableId,
            'players': [
                playerOneId,
                playerTwoId,
            ]
        })
        .end((err, res) => {
            sharedPingPongGameId = res.body.gameId;
            done();
        });
});

// todo: test real endpoint once its no longer a mock
// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe("health endpoint", () => {
    // noinspection JSUnresolvedFunction
    it("Should retrieve health status", (done) => {
        chai.request(app)
            .get('/health')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');     // todo: tighten this up once the endpoint is no longer a mock
                done();
            });
    });
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe("version endpoint", () => {
    // noinspection JSUnresolvedFunction
    it("Should return current version", (done) => {
        chai.request(app)
            .get('/version')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');

                // noinspection JSUnresolvedVariable
                console.log(JSON.stringify(`version: ${res.body.version}`));
                expect(res.body.version).to.equal(packageJson.version);
                done();
            });
    });
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe("/ping-pong/game endpoints", () => {
    // noinspection JSUnresolvedFunction
    it("GET game should succeed", (done) => {
        chai.request(app)
            .get(`/ping-pong/games/${sharedPingPongGameId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.gameId).to.be.a('string');
                done();
            });
    });

    // noinspection JSUnresolvedFunction
    it("GET game with bad ID should fail", (done) => {
        chai.request(app)
            .get('/ping-pong/games/foobar')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                console.log(JSON.stringify(err));
                done();
            });
    });

    // todo: need to have a way to indicate which side of table each player starts on
    // todo: need to have a way to indicate which player has initial serve
    // noinspection JSUnresolvedFunction
    it("POST to create game works successfully", (done) => {
        chai.request(app)
            .post('/ping-pong/games')
            .send({
                'tableId': tableId,
                'players': [
                    playerOneId,
                    playerTwoId,
                ]
            })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.gameId).to.be.a('string');
                done();
            });
    });
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe("/ping-pong/tables endpoints", () => {
    // noinspection JSUnresolvedFunction
    it("GET game by tableId should succeed", (done) => {
        chai.request(app)
            .get(`/ping-pong/tables/${tableId}/game`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.gameId).to.be.a('string');
                done();
            });
    });

    // noinspection JSUnresolvedFunction
    it("GET game by tableId with bad ID should fail", (done) => {
        chai.request(app)
            .get('/ping-pong/games/foobar/games')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                console.log(JSON.stringify(err));
                done();
            });
    });
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe("/ping-pong/tables/:tableId/events endpoints", () => {
    // noinspection JSUnresolvedFunction
    it("POST POINT_SCORED_ON_TABLE_AT_POSITION event succeeds", (done) => {
        chai.request(app)
            .post(`/ping-pong/tables/${tableId}/events`)
            .send({
                eventType: 'POINT_SCORED_ON_TABLE_AT_POSITION',
                tablePosition: 2
            })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.gameId).to.be.a('string');
                done();
            });
    });

    // noinspection JSUnresolvedFunction
    it("POSTing unsupported event yields 404", (done) => {
        chai.request(app)
            .post(`/ping-pong/tables/${tableId}/events`)
            .send({
                eventType: 'FOOBAR',
                playerId: playerOneId,
            })
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });
});

// noinspection NodeModulesDependencies,ES6ModulesDependencies
describe("/ping-pong/games/:gameId/events endpoints", () => {
    // noinspection JSUnresolvedFunction
    it("POST POINT_SCORED_BY_PLAYER event succeeds", (done) => {
        chai.request(app)
            .post(`/ping-pong/games/${sharedPingPongGameId}/events`)
            .send({
                eventType: 'POINT_SCORED_BY_PLAYER',
                playerId: playerOneId,
            })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.gameId).to.be.a('string');
                done();
            });
    });

    // noinspection JSUnresolvedFunction
    it("POST winning POINT_SCORED_BY_PLAYER event properly causes game to end", (done) => {
        const requester = chai.request(app).keepOpen();
        Promise.all([
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId}),
            requester.post(`/ping-pong/games/${sharedPingPongGameId}/events`).send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId})
        ])
        .then(responses => { console.log(JSON.stringify(responses))})
        .then(() => requester.close());

        // 11th point should cause game to end
        chai.request(app)
            .post(`/ping-pong/games/${sharedPingPongGameId}/events`)
            .send({eventType: 'POINT_SCORED_BY_PLAYER', playerId: playerOneId})
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.gameStatus).to.equal('COMPLETE');
                done();
            });
    });

    // noinspection JSUnresolvedFunction
    it("POSTing unsupported event yields 404", (done) => {
        chai.request(app)
            .post(`/ping-pong/games/${sharedPingPongGameId}/events`)
            .send({
                eventType: 'FOOBAR',
                playerId: playerOneId,
            })
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });
});