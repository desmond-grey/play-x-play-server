const express = require('express');
const path = require('path');
const logger = require('morgan');

const healthRouter = require('./routes/health-router');
const versionRouter = require('./routes/version-router');
const pingPongRouter = require('./routes/ping-pong-router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/health', healthRouter);
app.use('/api/version', versionRouter);
app.use('/api/ping-pong', pingPongRouter);

module.exports = app;
