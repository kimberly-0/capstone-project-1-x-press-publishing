const express = require('express');
const app = require('../server');

const apiRouter = express.Router();
module.exports = apiRouter;

const artistsRouter = require('./artists');
apiRouter.use('/artists', artistsRouter);

const seriesRouter = require('./series');
apiRouter.use('/series', seriesRouter);

