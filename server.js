var app = require('express').createServer()
  , io  = require('socket.io').listen(app)
  , hdr;

app.listen(8080);

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/sallar', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  
  socket.on('set nickname', function(name){
    socket.set('nickname', name, function(){
      socket.emit('ready');
    });
  });
  
  socket.on('msg', function (data) {
    socket.get('nickname', function(err, name){
      socket.broadcast.emit('clnt', [name, data]);
    });
  });
  
});