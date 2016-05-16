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

app.use(express.static('public'));
//home route style

// app.get('/:web', function(req,res){
//     var web = req.params.web
//     if(web.substr(0,5)==='https' ||web.substr(0,5)==='http:'){
//         var data = {
//             original: req.params.web,
//             shorty: "shawty"
//         }
//         res.json(data);
//     }
//     res.send('please use proper url-formatting with "http://www.example.com/" or "https://www.example.com/"')
    
// })


app.post('/api/shorten', function(req, res){
  // route to create and return a shortened URL given a long URL
});

app.get('/:encoded_id', function(req, res){
  // route to redirect the visitor to their original URL given the short URL
});



app.listen(port, function(){
	console.log('runnin on ' + port)
});

