const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const issuesRouter = express.Router({ mergeParams: true });

module.exports = issuesRouter;

issuesRouter.param('issueId', (req, res, next, id) => {
    db.get('SELECT * FROM Issue WHERE id = $id', {
        $id: Number(id)
    }, (err, issue) => {
        if (err) {
            next(err);
        } else if (issue) {
            req.issue = issue;
            next();
        } else {
            res.status(404).send();
        }
    });
});

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

issuesRouter.put('/:issueId', validateIssue, (req, res, next) => {
    const newIssue = req.body.issue;    
    db.run('UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId, series_id = $seriesId WHERE id = $id', {
        $id: req.issue.id,
        $name: newIssue.name,
        $issueNumber: newIssue.issueNumber,
        $publicationDate: newIssue.publicationDate,
        $artistId: newIssue.artistId,
        $seriesId: req.series.id
    }, (err) => {
        if (err) {
            next(err);
        }
        db.get('SELECT * FROM Issue WHERE id = $id', {
            $id: req.issue.id
        }, (err, issue) => {
            if (err) {
                next(err);
            } else if (!issue) {
                return res.status(500).send();
            }
            res.status(200).send({issue: issue});
        });
    });
});

issuesRouter.delete('/:issueId', (req, res, next) => {
    db.run('DELETE FROM Issue WHERE id = $id', {
        $id: req.issue.id,
    }, (err) => {
        if (err) {
            next(err);
        }
        res.status(204).send();
    });
});
