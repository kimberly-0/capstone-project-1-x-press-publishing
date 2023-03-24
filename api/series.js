const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const seriesRouter = express.Router();
module.exports = seriesRouter;

const issuesRouter = require('./issues');
seriesRouter.use('/:seriesId/issues', issuesRouter);
