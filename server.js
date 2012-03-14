var express = require('express')
  , app = express.createServer()
  , io  = require('socket.io').listen(app);

app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.listen(8080);

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {
  
  socket.on('set nickname', function(nick){
    socket.set('nickname', nick, function(){
      socket.emit('ready');
      socket.emit('clnt', {nick: {name:'SYSTEM',color:'red'}, msg: 'Welcome ' + nick.name});
    });
  });
  
  socket.on('msg', function (data) {
    if( data.length > 0 ){
      socket.get('nickname', function(err, name){
        io.sockets.emit('clnt', {nick: name, msg: data});
      });
    }
  });
  
});