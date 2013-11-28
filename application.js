var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');
app.listen(1337);

	var seconds = 25*60;
	var currentState = "trabajo";
	var periodsOfWorkCounter = 1;
	function initTempomodoro(){
		updateClock(seconds);
		setInterval(function(){
			var state = currentState;
			seconds--;
			if(seconds == 0){
				 if(currentState == "trabajo"){
					currentState = "recreo";
					if(periodsOfWorkCounter % 4 == 0){
						seconds = 20*60;
					}
					else{
						seconds = 5*60;
					}
				}else{
					periodsOfWorkCounter++;
					currentState = "trabajo";
					seconds = 25*60;	
				}
			}
			updateClock(seconds);
		}, 1000);
	};
	function updateClock(remainingSeconds){
		var remMinutes = remainingSeconds / 60;
		var remSeconds = remainingSeconds % 60;
		var mins = parseInt(remMinutes);
		var secs = parseInt(remSeconds);
		if(remSeconds < 10){
			secs = "0" + secs;
		}
		io.sockets.emit('updateStatus', {state:currentState, minutes:mins, seconds:secs});
	};
	initTempomodoro();
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
