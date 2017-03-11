angular.module('starter.facePlus', [])

.factory('facePlus', function($q,$http) {

  var facePpAPI = {
    ENDPOINT : 'https://api-us.faceplusplus.com/facepp/v3/',
    secret: 'sBbdR05BdbyTo8GOnrxCYKYWb22UCgJ-',
    key: 'sBXaPtWQnwTXXDqRBJ7f9p2DYij4w0nE'
  };

  return {
    doDetect:function(url,opts){
      $http.json(this.ENDPOINT+'detect/')
    }
  }

});
