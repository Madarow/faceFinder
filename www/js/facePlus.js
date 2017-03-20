angular.module('starter.facePlus', [])

.factory('facePlus', function($q,$http,$rootScope) {

  var facePpAPI = {
    ENDPOINT : 'https://api-us.faceplusplus.com/facepp/v3/',
    secret: 'sBbdR05BdbyTo8GOnrxCYKYWb22UCgJ-',
    key: 'sBXaPtWQnwTXXDqRBJ7f9p2DYij4w0nE'
  };

  var getDataUri = function(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}

  return {
    doDetect:function(opts){
      // Usage

      options = {
         fileKey: "image_file",
         fileName: 'img_test',
         chunkedMode: false,
         mimeType: "image/png"
      };
      getDataUri(opts.image_url, function(dataUri) {
          url = facePpAPI.ENDPOINT+'detect?api_secret='+facePpAPI.secret+'&api_key='+facePpAPI.key+'&return_attributes=gender,age';
          ft = new FileTransfer
          ft.upload(opts.image_url,encodeURI(url),function(r){
            console.log(r);
          },function(e){
            console.log(e);
          },options)
      });

    }
  }

});
