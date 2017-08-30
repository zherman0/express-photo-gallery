var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var path = require("path");
var directoryExists = require('directory-exists').sync;
var static = require('serve-static');

//var Gallery = require('express-photo-gallery');

var options = {
  title: 'Demo Photo Gallery',
  thumbnail: false
};

var photoPath = "/tmp/photos/";
//var photoPath = "http://bucket1.s3.amazonaws.com/";
//var photoPath = "/home/zherman/Pictures/Wallpapers/";
var paths = {
    photos: photoPath,
    previews: null,
    thumbs: null,
};

app.use(express.static(__dirname + '/public'));

//app.use('/photos', Gallery(photoPath, options));
app.use('/photos', require(__dirname + '/index.js')(photoPath, options));


app.use(fileUpload());

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.get('/new',function(req,res){
  res.sendFile(path.join(__dirname+'/upload.html'));
  //__dirname : It will resolve to your project folder.
});


app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(photoPath + req.files.sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.listen(3000);
