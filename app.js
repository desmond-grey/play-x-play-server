const express = require('express');
const path = require('path');
const logger = require('morgan');

const healthRouter = require('./routes/health-router');
const pingPongRouter = require('./routes/ping-pong-router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/health', healthRouter);
app.use('/ping-pong', pingPongRouter);

module.exports = app;
