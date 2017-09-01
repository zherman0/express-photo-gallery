var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var path = require("path");
var directoryExists = require('directory-exists').sync;
var static = require('serve-static');
var aws = require('aws-sdk');
var fs = require('fs');
const util = require('./util.js');
var http = require('http');

var options = {
  title: 'Demo Photo Gallery',
  thumbnail: false,
  bucket: "/tmp/photos",
  // These options are ignored if "s3:" is not in the path/bucket name
  region: "us-west-1",
  s3Type: "aws", //"gfs" for gluster
  clusterIP: null,
  clusterPort: null
};

// Valid options.buckets
// local : "/tmp/photos/"
// AWS S3: bucket: zac-demo-bucket1,  s3Type: "aws",Region: "us-west-1"
// Gluster: bucket bucket-demo-1, s3Type: "gfs", clusterIP: "12.34.56.78"

/* Config File:
export OBJECT_STORAGE_BUCKET1="demo-bucket1"
export OBJECT_STORAGE_BUCKET2="demo-bucket2"
export OBJECT_STORAGE_REGION="us-west-1"
export OBJECT_STORAGE_S3_TYPE="gfs"
export OBJECT_STORAGE_CLUSTER_IP="33.24.24.24"
export OBJECT_STORAGE_CLUSTER_IP="33104"

*/

// Go thru our expected environment values to see if they are set
var envStorageBucket1 = process.env.OBJECT_STORAGE_BUCKET1;
var envStorageBucket2 = process.env.OBJECT_STORAGE_BUCKET2;
var envStorageRegion = process.env.OBJECT_STORAGE_REGION;
var envS3Type = process.env.OBJECT_STORAGE_S3_TYPE;
var envClusterIP = process.env.OBJECT_STORAGE_CLUSTER_IP;
var envClusterPort = process.env.OBJECT_STORAGE_CLUSTER_PORT;

if (envStorageBucket1) {
    options.bucket = envStorageBucket1;
}
if (envStorageRegion) {
    options.region = envStorageRegion;
}
if (envS3Type) {
    options.s3Type = envS3Type;
}
if (envClusterIP) {
    options.clusterIP = envClusterIP;
}
if (envClusterPort) {
    options.clusterPort = envClusterPort;
}


app.use(express.static(__dirname + '/public'));

//app.use('/photos', Gallery(options.bucket, options));
app.use('/photos', require(__dirname + '/index.js')(options.bucket, options));


app.use(fileUpload());

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/new',function(req,res){
  res.sendFile(path.join(__dirname+'/upload.html'));
});

app.get("/getvar", function(req, res){
    res.json(options);
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 // console.log("File", req.files.sampleFile);
  if (!util.isObjectStore(options)) {
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(util.buildS3url(options) + req.files.sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);
    });
  }
  else if (options.s3Type === 'aws'){  //Object Store like S3 or glusterFS
    //need to putObject
    var s3 = new aws.S3();
    var param = {
      Bucket: options.bucket,
      Key: req.files.sampleFile.name,
      Body: new Buffer(sampleFile.data)
    };
    s3.putObject(param, function(err, data){
      if(err) console.log(err);
      else console.log(data);
    });

  }
  else { //use this for gluster Obj Store

    var param = {
      host: options.clusterIP,
      port: options.clusterPort,
      path: options.bucket + '/' + req.files.sampleFile.name,
      method: 'PUT',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'image/png',
          'Content-Length': req.files.sampleFile.data.length
        },
      body: new Buffer(sampleFile.data)
    };
//    var putReq = http.request(param);
    var putReq = http.request(param, function(res) {
//      putReq.write(new Buffer(sampleFile.data));
    });
    putReq.on('error', function(e) {
      console.log('Error==>',e);
    });
    putReq.end();
  }




//   res.send('File uploaded!');
  setTimeout(function() {
    res.redirect('/photos');
  }, 10000);
//   res.redirect('/photos');

});

app.listen(3000);
