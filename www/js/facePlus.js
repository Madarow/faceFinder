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
         mimeType: "image/png",
      };
      getDataUri(opts.image_url, function(dataUri) {
          url = facePpAPI.ENDPOINT+'detect?api_secret='+facePpAPI.secret+'&api_key='+facePpAPI.key;
          ft = new FileTransfer
          ft.upload(opts.image_url,encodeURI(url),function(r){
            console.log(r);
          },function(e){
            console.log(e);
          },options)
          // Do whatever you'd like with the Data URI!
          // $http({
          //   method:'POST',
          //   url:facePpAPI.ENDPOINT+'detect',
          //   headers: {
          //      'Content-Type': 'multipart/form-data'
          //  },
          //  params:{
          //    api_key:facePpAPI.key,
          //    api_secret:facePpAPI.secret,
          //    image_url:opts.image_url
          //  },
          //  data: {
          //      image_file: dataUri
          //   },
          //   transformRequest: function (data, headersGetter) {
          //               var formData = new FormData();
          //               angular.forEach(data, function (value, key) {
          //                   formData.append(key, value);
          //               });
          //               return formData;
          //           }
          // }).then((r)=>{
          //   console.log(r);
          // })
      });

    //   $http.post(facePpAPI.ENDPOINT+'detect?api_key='+facePpAPI.key
    //                                +'&api_secret='+facePpAPI.secret
    //                                +'&image_url='+opts.image_url
    //                                +'&return_attributes='+opts.return_attributes
    //                              ).then((re)=>{
    //                                console.log(re);
    //                              })
    //   opts.api_secret = facePpAPI.secret;
    //   opts.api_key = facePpAPI.key;
    //   $http({ method:'POST',
    //           url:this.ENDPOINT+'detect/',
    //           header:{
    //             'Content-type':opts
    //             }
    //         }).then((responce) => {
    //             console.log(responce);
    //           })
    }
  }

});
