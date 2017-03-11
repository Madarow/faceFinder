angular.module('starter.facePlus', [])

.factory('facePlus', function($q,$http) {

  var facePpAPI = {
    ENDPOINT : 'https://api-us.faceplusplus.com/facepp/v3/',
    secret: 'sBbdR05BdbyTo8GOnrxCYKYWb22UCgJ-',
    key: 'sBXaPtWQnwTXXDqRBJ7f9p2DYij4w0nE'
  };

  return {
    doDetect:function(opts){
      $http.post(facePpAPI.ENDPOINT+'detect?api_key='+facePpAPI.key
                                   +'&api_secret='+facePpAPI.secret
                                   +'&image_url='+opts.image_url
                                   +'&return_attributes='+opts.return_attributes
                                 ).then((re)=>{
                                   console.log(re);
                                 })
      // opts.api_secret = facePpAPI.secret;
      // opts.api_key = facePpAPI.key;
      // $http({ method:'POST',
      //         url:this.ENDPOINT+'detect/',
      //         header:{
      //           'Content-type':opts
      //           }
      //       }).then((responce) => {
      //           console.log(responce);
      //         })
    }
  }

});
