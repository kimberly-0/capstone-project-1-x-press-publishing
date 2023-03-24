const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const seriesRouter = express.Router();
module.exports = seriesRouter;

const issuesRouter = require('./issues');
seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.param('seriesId', (req, res, next, id) => {
    db.get('SELECT * FROM Series WHERE id = $id', {
        $id: Number(id)
    }, (err, series) => {
        if (err) {
            next(err);
        } else if (series) {
            req.series = series;
            next();
        } else {
            res.status(404).send();
        }
    });
});

seriesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Series', (err, series) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({series: series});
        }
    });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    res.status(200).send({series: req.series});
});


const validateSeries = (req, res, next) => {
    const toCreateSeries = req.body.series;
    if (!toCreateSeries.name || !toCreateSeries.description) {
        return res.status(400).send();
    }
    next();
};

seriesRouter.post('/', validateSeries, (req, res, next) => {
    const toCreateSeries = req.body.series;
    db.run('INSERT INTO Series (name, description) VALUES ($name, $description)', {
        $name: toCreateSeries.name,
        $description: toCreateSeries.description
    }, function(err) {
        if (err) {
            console.log(err);
        }
        db.get('SELECT * FROM Series WHERE id = $id', {
            $id: this.lastID
        }, (err, series) => {
            if (err) {
                next(err);
            } else if (!series) {
                return res.status(500).send();
            }
            res.status(201).send({series: series});
        });
    });
});

seriesRouter.put('/:seriesId', validateSeries, (req, res, next) => {
    const newSeries = req.body.series;    
    db.run('UPDATE Series SET name = $name, description = $description WHERE id = $id', {
        $id: req.series.id,
        $name: newSeries.name,
        $description: newSeries.description
    }, function(err) {
        if (err) {
            next(err);
        }
        db.get('SELECT * FROM Series WHERE id = $id', {
            $id: req.series.id
        }, (err, series) => {
            if (err) {
                next(err);
            } else if (!series) {
                return res.status(500).send();
            }
            res.status(200).send({series: series});
        });
    });
});
