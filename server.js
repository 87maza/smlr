var express  = require('express');
var morgan = require('morgan');
var fs = require('fs');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000
var app = express();
app.use(favicon(__dirname + '/android-icon-192x192.png'));

app.use(morgan('short'));

app.get('/', function(req,res){
	fs.createReadStream(__dirname + '/index.html').pipe(res);
})


app.get('/data', function(req,res){
	var ip = req.headers['x-forwarded-for'] || 
    	req.connection.remoteAddress || 
    	req.socket.remoteAddress ||
    	req.connection.socket.remoteAddress;
    var lang = req.headers['accept-language'].substring(0,5);
    var os = req.headers['user-agent'].match(/\((.+?)\)/,"")[1];
    var obj = {
    	ip : ip,
    	language: lang,
    	os: os
    }
    res.json(obj);
})


app.listen(port, function(){
	console.log('runnin on ' + port)
});

