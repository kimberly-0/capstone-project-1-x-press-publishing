const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const issuesRouter = express.Router({ mergeParams: true });

module.exports = issuesRouter;

issuesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Issue WHERE series_id = $seriesId', {
        $seriesId: req.series.id
    }, (err, issues) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({issues: issues});
        }
    });
});

const validateIssue = (req, res, next) => {
    const toCreateIssue = req.body.issue;
    if (!toCreateIssue.name || !toCreateIssue.issueNumber || !toCreateIssue.publicationDate || !toCreateIssue.artistId) {
        return res.status(400).send();
    }
    // Check if artist exists
    db.get('SELECT * FROM Artist WHERE id = $id', {
        $id: toCreateIssue.artistId
    }, (err, artist) => {
        if (err) {
            next(err);
        } else if (artist) {
            req.artist = artist;
            next();
        } else {
            res.status(400).send();
        }
    });
};

issuesRouter.post('/', validateIssue, (req, res, next) => {
    const toCreateIssue = req.body.issue;
    db.run('INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)', {
        $name: toCreateIssue.name,
        $issueNumber: toCreateIssue.issueNumber,
        $publicationDate: toCreateIssue.publicationDate, 
        $artistId: toCreateIssue.artistId, 
        $seriesId: req.series.id
    }, function(err) {
        if (err) {
            console.log(err);
        }
        db.get('SELECT * FROM Issue WHERE id = $id', {
            $id: this.lastID
        }, (err, issue) => {
            if (err) {
                next(err);
            } else if (!issue) {
                return res.status(500).send();
            }
            res.status(201).send({issue: issue});
        });
    });
});
