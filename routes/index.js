var express = require('express');
var router = express.Router();
var firstSeries = true;
var seriesList = [];
var seriesCounter = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'World Series' }); //index.jade is the corresponding jade
});

router.get('/refreshTaken', function(req, res) {
  firstSeries = true;
  seriesCounter = 0;
  seriesList = [];
});

/* GET Userlist page. */
router.get('/series', function(req, res) {
  if (firstSeries) {
    firstSeries = false;
    var db = req.db;
    var collection = db.get('series');
    collection.find({}, {}, function (e, docs) {
      docs.forEach(function(doc, index) {
        seriesList.push({title: doc.title, poster: doc.poster});
      });
      res.render('serieslist', {
        "series": seriesList.slice(seriesCounter, Math.min(seriesCounter + 50, seriesList.length))
      });
      seriesCounter += 50;
    });
  }
  else {
    var appendJade = "";
    var nextChunk = seriesList.slice(seriesCounter, Math.min(seriesCounter + 50, seriesList.length));
    for (var series in nextChunk) {
      appendJade
          +=           '<div>'
          +                 '<img src="/images/place-holder-240x200.jpg" data-src="{{poster}}" class="lazyload" '
          +                 'style="width:160px; height:225px; border:4px groove black; float:left; margin-right: 2%; margin-bottom: 1em "'
          +                 'title="{{title}}" alt="{{title}}" />'
          +            '</div> ';

      appendJade = appendJade.replace(/\{\{poster}}/g, nextChunk[series].poster);
      appendJade = appendJade.replace(/\{\{title}}/g, nextChunk[series].title);
    }
    seriesCounter += 50;
    res.send(appendJade);
  }
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.insert({
    "username" : userName,
    "email" : userEmail
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("userlist");
    }
  });
});

/* handle the search */
router.get('/search',function(req,res){
  var db = req.db,
      collection = db.get('series'),
      titleList = [],
      re = new RegExp(".*" + req.query.key + ".*","i");

  collection.find({"title" : re}, {}, function (e, docs) {
    docs.forEach(function(doc, index) {
      titleList.push(doc.title);
    });
    res.end(JSON.stringify(titleList))
  });
});

module.exports = router;
