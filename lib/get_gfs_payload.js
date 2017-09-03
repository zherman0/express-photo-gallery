var http = require('http');
var xmlParse = require('xml2js').parseString;
var path = require('path');
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');
const util = require('../util.js');
var Client = require('node-rest-client').Client;

module.exports = function(userOptions, callback) {

  var photoObjects = [];
  var client = new Client();
  var goapiserver = "http://localhost";
  var goapiserverPort = "8888";
  var method = "getBucket";
  var bucket = userOptions.bucket;

  var apiUrl = goapiserver + ':' + goapiserverPort + '/' + method + '/' + bucket;

  client.get( apiUrl, function (data, response) {
      data.forEach (function(file) {
           var photoObject = {};

          if (isImage(file)) {
            photoObject.src = apiUrl + '/' + file;
            photoObjects.push(photoObject);
          }
      }); //end for each

        var mandatorySettings = {
          dynamic: true,
          dynamicEl: photoObjects,
          closable: false,
          escKey: false,
        };

        var optionalSettings = {
          download: true,
          thumbnail: false
        };

        var payload = objectAssign(optionalSettings, userOptions, mandatorySettings);

        callback(payload);

  }); //end client get


};
