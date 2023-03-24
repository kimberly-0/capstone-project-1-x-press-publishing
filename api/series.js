const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const seriesRouter = express.Router();
module.exports = seriesRouter;

const issuesRouter = require('./issues');
seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Series', (err, series) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({series: series});
        }
    });
});
