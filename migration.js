const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS Artist (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1)', (err) => {
        if (err) console.log(err);
    });

    db.run(`INSERT INTO Artist (id, name, date_of_birth, biography, is_currently_employed)
    VALUES 
    (1, 'John Smith', '1990-01-01', 'John Smith is a musician from New York City.', 1),
    (2, 'Jane Doe', '1985-02-14', 'Jane Doe is a singer-songwriter from Los Angeles.', 1),
    (3, 'Bob Johnson', '1978-05-22', 'Bob Johnson is a guitarist from Nashville.', 1),
    (4, 'Sarah Lee', '1992-11-03', 'Sarah Lee is a violinist from Chicago.', 1),
    (5, 'David Chen', '1980-09-15', 'David Chen is a pianist from San Francisco.', 1),
    (6, 'Amanda Smith', '1983-07-08', 'Amanda Smith is a bassist from Miami.', 1),
    (7, 'Chris Davis', '1995-12-30', 'Chris Davis is a drummer from Seattle.', 1),
    (8, 'Mary Wilson', '1998-04-17', 'Mary Wilson is a cellist from Boston.', 1),
    (9, 'Kevin Kim', '1991-06-19', 'Kevin Kim is a saxophonist from Washington D.C.', 1),
    (10, 'Rachel Lee', '1989-08-24', 'Rachel Lee is a flutist from Atlanta.', 1),
    (11, 'George Brown', '1975-03-11', 'George Brown is a harmonica player from New Orleans.', 1),
    (12, 'Karen Davis', '1987-12-28', 'Karen Davis is a clarinetist from Dallas', 1);
    `, (err) => {
        if (err) console.log(err);
    });
});