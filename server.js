'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
var cors = require('cors');
const URL = require('url');
const ShortUrlIndex = require('./model/shortindex');
const CreateShortUrl = require('./model/shorturl');
var app = express();

app.use(
  bodyParser.urlencoded({ extended: true })
)

app.use(bodyParser.json());
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.get("/api/shorturl/:id", (req, res) => {
  const shortUrl = req.params.id;
  CreateShortUrl.ShortUrl.findOne({ short_url: shortUrl }, (err, data) => {
    if (err) {
      res.json(console.error(err));
    }
    const originalUrl = data.original_url;
    res.redirect(originalUrl);
  })
});
app.post("/api/shorturl/new", function (req, res) {
  // res.json({url: req.body });
  const longUrl = URL.parse(req.body.url);
  const hostname = longUrl.hostname;
  if (!longUrl.hostname){
    res.json({ error: "invalid URL" });
  }
  dns.lookup(hostname, (err, data) => {
    if(err) {
      res.json({ error: "invalid URL" });
    }
    
    ShortUrlIndex.ShortUrlIndex.findOne({}, (err, data) => {
      const indexDoc = data;
      if (err)
        res.json(console.error(err));
      let index;
      if(data) {
        index = data.index + 1;
      } else {
        index = 1;
      }
      
        CreateShortUrl.ShortUrl.create([{ original_url: req.body.url, short_url: index }], (err, data) => {
          if (err) {
            res.json(console.error(err));
          }
          if (indexDoc) {
            ShortUrlIndex.ShortUrlIndex.updateOne({index: index}, (err, data) => {
              if (err) {
                console.log(68);
                res.json({ error: err });
              }
              res.json({ "original_url": req.body.url, "short_url": index });
            })
          } else {
           ShortUrlIndex.ShortUrlIndex.create({index: index}, (err, data) => {
              if (err) {
                res.json({ error: err });
              }
              res.json({ "original_url": req.body.url, "short_url": index });
            })
          }
        });
    });
    // res.json({ data: 'ok' });
    // console.log(x);
    // res.json({ data: longUrl });
    
  })
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});