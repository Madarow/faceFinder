angular.module('starter.facePlus', [])

  .factory('facePlus', function($q, $http, $rootScope) {


    var facePpAPI = {
      ENDPOINT: 'https://api-us.faceplusplus.com/facepp/v3/',
      secret: 'sBbdR05BdbyTo8GOnrxCYKYWb22UCgJ-',
      key: 'sBXaPtWQnwTXXDqRBJ7f9p2DYij4w0nE'
    };

    var getDataUri = function(url, callback) {
      var image = new Image();

      image.onload = function() {
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
      doDetect: function(opts) {
        var defer = $q.defer()

        var ft = new FileTransfer
        // Usage
        options = {
          fileKey: "image_file",
          fileName: 'img_test',
          chunkedMode: false,
          mimeType: "image/png"
        };

        getDataUri(opts.image_url, function(dataUri) {
          url = facePpAPI.ENDPOINT + 'detect?api_secret=' + facePpAPI.secret + '&api_key=' + facePpAPI.key + '&return_attributes=gender,age,ethnicity';
          ft.upload(opts.image_url, encodeURI(url), function(r){
            defer.resolve(r)
          }, function(er){
            defer.resolve(er)
          }, options);
        });
        return defer.promise;

      },

      doCompar: function(opts){
        console.log(opts);
        url = facePpAPI.ENDPOINT + 'compare?api_secret=' + facePpAPI.secret + '&api_key=' + facePpAPI.key+'&face_token1='+opts[0].face[0].face_token+'&face_token2='+opts[1].face[0].face_token;
        $http.post(url).then((r) => {
          console.log(r);
        })
      }

    }

  });
