const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text, 
            password text 
            )`,
        (err) => {
            if (err) {
                //console.error(err)
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (username, password) VALUES (?,?)';
                db.run(insert, ["user","password"])
            }
        });  
    }
});


module.exports = db