var express = require('express');
var request = require('request');
var flash = require('express-flash-messages');
var router = express.Router();
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
var s3 = new aws.S3({ /* ... */ })
var textractApi = 'https://l30op9e8x9.execute-api.us-east-1.amazonaws.com/textract-dev/TextractPSScript'
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'textracter',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.file)
  {
    postByUrl(req, res, next);
  }
  else
  {
    res.render('index', { title: 'Pictext', imageurl: '', textractJson: '{DocumentMetadata: {Pages: 1}}'});
  }
});

router.post('/', upload.single('fileUpload'), function(req, res, next) {
  writeIP(req);

  if(req.file)
  {
    console.log(req.file);
    var s3key = req.file.key;
    var s3url = req.file.location;
    var headersOpt = {  
      "content-type": "application/json"
    };
    request.post(textractApi, 
    {
      json: {url: '', bucketname: 'textracter', s3key: s3key}
    }, (error, response, body) => {
        if (error) {
          console.error(error)
          return
        }
        var textract = {DocumentMetadata: {Pages: 1},Blocks: []};
        textract.Blocks = body;
        res.render('index', { title: 'Pictext', textractJson: JSON.stringify(textract), imageurl: s3url});
        });
  }
  else
  {
    postByUrl(req,res, next);
  }
});
var writeIP = (req) =>
{
  var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
  req.connection.remoteAddress || 
  req.socket.remoteAddress || 
  req.connection.socket.remoteAddress;
  console.log(ip);
};
var postByUrl = (req, res, naext) =>
{
    var imageurl = req.body.file;
    if(!imageurl && req.query.file)
    {
      imageurl = req.query.file;
    }
    request.head(imageurl,{rejectUnauthorized: false}, (error, response, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(response.headers);
      if(response.headers['content-length']>2097152 || !response.headers['content-type'].startsWith('image'))
      {
        req.flash('error', "Either the file size is more than 2 MB or the file is not a valid image file.");
        res.render('index', { title: 'Pictext', imageurl: '', textractJson: '{DocumentMetadata: {Pages: 1}}'})
      }
      else
      {
        var headersOpt = {  
          "content-type": "application/json"
        };
        request.post(textractApi, 
        {
          json: {url: imageurl, bucketname: 'textracter', s3key: ''}
        }, (error, response, body) => {
            if (error) {
              console.error(error)
              return
            }
            var textract = {DocumentMetadata: {Pages: 1},Blocks: []};
            textract.Blocks = body;
            res.render('index', { title: 'Pictext', textractJson: JSON.stringify(textract), imageurl: imageurl});
            });
      }
    });  
};

module.exports = router;