exports.isObjectStore = function(options) {
  return (options.s3Type === 'aws') || (options.s3Type === 'gfs');

};
exports.buildS3url = function(options) {
    var s3 = this.isObjectStore(options);

    var bucket = options.bucket;

    if (!s3) {
      return options.bucket;
    }

    var s3url = '';
    if (options.s3Type == "aws") {
        s3url = 'https://' + bucket ;
        if (options.region) {
          s3url += '.s3-' + options.region +'.amazonaws.com/';
        }
        else {
          s3url += '.s3.amazonaws.com/';
        }
    }
    else if (options.s3Type == "gfs") {
        s3url = 'https://' + options.clusterIP +':'+ options.clusterPort + '/' + bucket + '/';
    }
    else {
      s3url = options.bucket;
    }
    return s3url;
};