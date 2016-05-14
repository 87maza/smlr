var express  = require('express');
var morgan = require('morgan');
var fs = require('fs');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000
var app = express();
var mongoose = require('mongoose');
app.use(favicon(__dirname + '/android-icon-192x192.png'));
app.use(morgan('short'));

mongoose.connect("mongodb://admin:admin@ds021922.mlab.com:21922/shorty");

app.get('/', function(req,res){
	fs.createReadStream(__dirname + '/index.html').pipe(res);
})

app.get('/:web', function(req,res){
    var web = req.params.web
    if(web.substr(0,5)==='https' ||web.substr(0,5)==='http:'){
        var data = {
            original: req.params.web,
            shorty: "shawty"
        }
        res.json(data);
    }
    res.send('please use proper url-formatting with "http://www.example.com/" or "https://www.example.com/"')
    
})

app.listen(port, function(){
	console.log('runnin on ' + port)
});

