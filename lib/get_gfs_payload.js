var http = require('http');
var xmlParse = require('xml2js').parseString;
var path = require('path');
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');
//var crypto = require('crypto');
var aws = require('aws-sdk');
const util = require('../util.js');
var Minio = require('minio');
var jquery = require('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js');


module.exports = function(userOptions, callback) {


/*
var s3Client = new Minio.Client({
  endPoint: userOptions.clusterIP ,
  port: parseInt(userOptions.clusterPort),
  secure: false,
  accessKey: "jcope:jcope",
  secretKey: "jcope"
});

var stream = s3Client.listObjectsV2(userOptions.bucket,'', true);
stream.on('data', function(obj) { console.log(obj) } );
stream.on('error', function(err) { console.log(err) } );
*/

/*
s3Client.listBuckets(function(err, buckets) {
  if (err) return console.log(err)
  console.log('buckets :', buckets);
});

s3Client.makeBucket('zac-bucketname', '', function(e) {
  if (e) {
    return console.log(e)
  }
  console.log("Success");
});*/
/*
// List all object paths in bucket my-bucketname.
var objectsStream = s3Client.listObjectsV2(userOptions.bucket, '', true);
objectsStream.on('data', function(obj) {
  console.log(obj);
});
objectsStream.on('error', function(e) {
  console.log(e);
});
*/




//  aws.config.loadFromPath('./config.json');
/*
  var cognitoidentity = new aws.CognitoIdentity({
     apiVersion: '2014-06-30',
     endpoint: 'http://' + userOptions.clusterIP + ':' + userOptions.clusterPort,
     s3BucketEndpoint: true,
     sslEnabled: false
     });

  var paramsId = {
    IdentityId: 'jcope:jcope', */
/* required */

/*
  }

  cognitoidentity.getCredentialsForIdentity(paramsId, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
*/


  var s3 = new aws.S3({
    signatureVersion: 'v4',
    endpoint: 'http://' + userOptions.clusterIP + ':' + userOptions.clusterPort,
    s3BucketEndpoint: true,
    s3ForcePathStyle: false,
    accessKeyId: 'jcope:jcope',
    secretAccessKey: 'jcope',
    sslEnabled: false });

//  var paramsBucket = {
//    Bucket: 'zac-qqtest-1',
//    ACL: "public-read-write",
//
//  }

// s3.createBucket(paramsBucket, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
//  });

//
//aws.config.getCredentials(function(err) {
//  if (err) console.log(err.stack); // credentials not loaded
//  else console.log("Access Key:", aws.config.credentials);
//})



  var params = {
    Bucket: userOptions.bucket,
  };
  s3.listObjects(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);
   });





/*
  var keyId = "jcope:jcope";
  var signature = crypto.createHmac('sha1', keyId).update("jcope").digest('base64');
//  crypto.createHash('sha1').update(JSON.stringify("jcope"))
  console.log("Signature:", signature);
  var param = {
    hostname: userOptions.clusterIP,
    port: userOptions.clusterPort,
    path: '/' + userOptions.bucket,
    method: 'GET',
    headers: {
            Authorization: 'AWS ' + keyId + ':' + signature
            },
  };

  var req = http.request(param, function(response) {
    var xml = '';
console.log("Response:", response);
    response.on('data', function(data) {
      xml += data;
      console.log("XML==>", xml);
    });
     response.on('error', function(err){
       console.log('Error==>',err);
    //    throw err;  //add message
      })

    response.on('end', function() {

      xmlParse(xml, function(err, result) {
        var photoObj = {};
        console.log("Results:",result);
        result.ListBucketResult.Contents.forEach(function(item) {
          var filePath = path.parse(item.Key[0]);
          var dir = filePath.dir || 'root';
          var name = filePath.base;

          if (!photoObj[dir]) {
            photoObj[dir] = [name];
          } else {
            photoObj[dir].push(name);
          }

        });

        var photoObjects = [];

        photoObj.root.forEach(function(file) {
          var photoObject = {};

          if (isImage(file)) {
            photoObject.src = util.buildS3url(userOptions) + file;
            photoObjects.push(photoObject);
          }
        });

          var mandatorySettings = {
            dynamic: true,
            dynamicEl: photoObjects,
            closable: false,
            escKey: false,
          };

          var optionalSettings = {
            download: true,
            thumbnail: !!photoObj.thumbs
          };

          var payload = objectAssign(optionalSettings, userOptions, mandatorySettings);

          callback(payload);

      });
    });

  })
console.log("Req==>", req);
  req.on('error', function(err){
   console.log('Error==>',err);
//    throw err;  //add message
  })

  req.end();
*/

};
