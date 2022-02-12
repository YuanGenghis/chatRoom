const express = require('express')
const path = require('path')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const PORT = 3000 || process.env.PORT
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = require('./utils/database')
const formatMessage = require('./utils/utils')

const initializePassport = require('./utils/passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

app.use(passport.initialize())
app.use(passport.session())

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/styles'))


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/', passport.authenticate('local', {
  successRedirect: '/chatroom',
  failureRedirect: '/chatroom' }));

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/register.html'));
});

app.get('/chatroom', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/chatroom.html'));
});

app.post('/register', async (req, res) => {
  try {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const data = {
      name: req.body.username,
      password: hashedPassword
    }
    const sql ='INSERT INTO user (username, password) VALUES (?,?)'
    const params =[data.name, data.password]
    db.run(sql,params)
    console.log("add succesful")
    res.redirect('/')
  }
  catch {
    res.redirect('/register')
  }
  })




//establish socket connection
io.on('connection', (socket) => {
    console.log('a user connected');

    //distribute any user messages to all connected clients
    socket.on('chat message', (msg) => {
      io.emit('message', formatMessage(msg));
    });

    socket.on('disconnect', () => {
      console.log('a user has disconnected')
    })
  });
  
  
http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})