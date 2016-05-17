var express  = require('express');
var morgan = require('morgan');
var fs = require('fs');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var config = require('./config');
// base58 for encoding and decoding functions
var base58 = require('./base58.js');

// grab the url model
var Url = require('./shortyModel');



app.use(favicon(__dirname + '/android-icon-192x192.png'));
app.use(morgan('short'));

mongoose.connect("mongodb://admin:admin@ds021922.mlab.com:21922/shorty");
// mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);



// handles JSON bodies
app.use(bodyParser.json());
// handles URL encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      // base58 encode the unique _id of that document and construct the short URL
      shortUrl = config.webhost + base58.encode(doc._id);

      // since the document exists, we return it without creating a new entry
      res.send({'shortUrl': shortUrl});
    } else {
      // The long URL was not found in the long_url field in our urls
      // collection, so we need to create a new entry:
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
  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      // found an entry in the DB, redirect the user to their destination
      res.redirect(doc.long_url);
    } else {
      // nothing found, take 'em home
      res.redirect(config.webhost);
    }
  });

});



app.listen(port, function(){
	console.log('runnin on ' + port)
});

