var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var path = require("path");
var directoryExists = require('directory-exists').sync;
var static = require('serve-static');

var options = {
  title: 'Demo Photo Gallery',
  thumbnail: false,
  bucket: "/tmp/photos",
  // These options are ignored if "s3:" is not in the path/bucket name
  region: "us-west-1",
  s3Type: "aws", //"gfs" for gluster
  clusterIP: null
};

// Valid options.buckets
// local : "/tmp/photos/"
// AWS S3: bucket: s3://zac-demo-bucket1, Region: "us-west-1"
// Gluster: bucket s3://bucket-demo-1, s3Type: "gfs", clusterIP: "12.34.56.78"


// Go thru our expected environment values to see if they are set
var envStorageBucket1 = process.env.OBJECT_STORAGE_BUCKET1;
var envStorageBucket2 = process.env.OBJECT_STORAGE_BUCKET2;
var envStorageRegion = process.env.OBJECT_STORAGE_REGION;
var envS3Type = process.env.OBJECT_STORAGE_S3_TYPE;
var envClusterIP = process.env.OBJECT_STORAGE_CLUSTER_IP;

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

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(options.bucket + req.files.sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

//   res.send('File uploaded!');
   res.redirect('/photos');
  });
});

app.listen(3000);
