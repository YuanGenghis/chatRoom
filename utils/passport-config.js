const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const bcrypt = require('bcrypt')
const db = require('./database')

function initialize(passport, getUserByEmail, getUserById){
    passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username)
        db.get('SELECT username FROM user WHERE username = ?', username, function(err, row) {
            if (!row) return done(null, false, { message: 'Incorrect username.' })
            db.get('SELECT id, password FROM user WHERE  password = ?', password, function(err, row) {
                if (!row) return done(null, false, { message: 'Incorrect password.' })
                return done(null, row);
            })
        })
    }))
    
    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    })
  
    passport.deserializeUser(function(id, done) {
    db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    })
  })
}
  module.exports = initialize