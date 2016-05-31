var express  = require('express');
var morgan = require('morgan');
var fs = require('fs');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var config = require('./config');
var base58 = require('./base58');

var Url = require('./shortyModel');

app.use(favicon(__dirname + '/android-icon-192x192.png'));
app.use(morgan('short'));

mongoose.connect("mongodb://admin:admin@ds021922.mlab.com:21922/shorty");
// mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/api/shorten', function(req, res){
  //adds http to urls
  var longUrl = req.body.url.replace(/ /g, '');
    if(longUrl.substr(0,4) !== 'http:' || longUrl.substr(0,4)!== 'https'){
        longUrl = "http://" + longUrl;
    }
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);
      res.send({'shortUrl': shortUrl});
    } else {
      // The long URL was not found in the long_url field in our url
      var newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }
        // construct the short URL
        shortUrl = config.webhost + base58.encode(newUrl._id);
        res.send({'shortUrl': shortUrl});
      });
    }
  });
});

app.get('/:encoded_id', function(req, res){
  var base58Id = req.params.encoded_id;
  console.log(base58Id);
  var id = base58.decode(base58Id);
  console.log(base58Id);
  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    
    if (doc) {
      // found an entry in the DB, redirect the user to their destination
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});



app.listen(port, function(){
	console.log('runnin on ' + port)
}); 

