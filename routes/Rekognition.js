var express = require('express');
var request = require('request');
var flash = require('express-flash-messages');
var router = express.Router();
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
var s3 = new aws.S3({ /* ... */ })
var rekognitionApi = 'RekognitionPSScript API URL'
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
  res.render('Rekognition', { title: 'Pictext-beta', imageurl: '', textractJson: '{DocumentMetadata: {Pages: 1}}'});
});

router.post('/', upload.single('fileUpload'), function(req, res, next) {
  var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
  req.connection.remoteAddress || 
  req.socket.remoteAddress || 
  req.connection.socket.remoteAddress;
  console.log(ip);

  if(req.file)
  {
    console.log(req.file);
    var s3key = req.file.key;
    var s3url = req.file.location;
    var headersOpt = {  
      "content-type": "application/json"
    };
    request.post(rekognitionApi, 
    {
      json: {url: '', bucketname: 'textracter', s3key: s3key}
    }, (error, response, body) => {
        if (error) {
          console.error(error)
          return
        }
        var textract = {DocumentMetadata: {Pages: 1},Blocks: []};
        textract.Blocks = body;
        res.render('Rekognition', { title: 'Pictext-beta', textractJson: JSON.stringify(textract), imageurl: s3url});
        });
  } else {
    var imageurl = req.body.file;
    request.head(imageurl,{rejectUnauthorized: false}, (error, response, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(response.headers);
      if(response.headers['content-length']>2097152 || !response.headers['content-type'].startsWith('image'))
      {
        req.flash('error', "Either the file size is more than 2 MB or the file is not a valid image file.");
        res.render('Rekognition', { title: 'Pictext-beta', imageurl: '', textractJson: '{DocumentMetadata: {Pages: 1}}'})
      }
      else
      {
        var headersOpt = {  
          "content-type": "application/json"
        };
        request.post(rekognitionApi, 
        {
          json: {url: imageurl, bucketname: 'textracter', s3key: ''}
        }, (error, response, body) => {
            if (error) {
              console.error(error)
              return
            }
            var textract = {DocumentMetadata: {Pages: 1},Blocks: []};
            textract.Blocks = body;
            res.render('Rekognition', { title: 'Pictext-beta', textractJson: JSON.stringify(textract), imageurl: imageurl});
            });
      }
    });  
  }
});

module.exports = router;