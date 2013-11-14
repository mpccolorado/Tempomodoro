var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');
app.listen(1337);

function handler (req, res) {
  fs.readFile('./index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
io.sockets.on('connection', function (socket) {
  io.sockets.emit('this', { will: 'be received by everyone'});

  socket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  socket.on('updateStatus', function(socket){
    io.sockets.emit('updateStatus', socket);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});

console.log('Server running at http://10.0.0.11:1337/');
