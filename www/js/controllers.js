angular.module('starter.controllers', [])

// $rootScope contain all cordova dependencies

.controller('HomeCtrl', function($scope,$rootScope,$ionicLoading) {




  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...',
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };

  $scope.newPicture = function(){
    var options = {
        cameraDirection:'FRONT'
    };

    $rootScope.camera.getPicture($scope.newPictureSuccess,$scope.newPictureError,options)
  }

  $scope.newPictureSuccess = function(picture){
    // $scope.mySelfie =
    window.resolveLocalFileSystemURL(picture,function(success){
      console.log(success);
    },function(error){
      console.log(error);
    });

  }


  $scope.newPictureError = function(error){
    console.log(error);
  }

  /*LOAD */
  $scope.show();

  ionic.Platform.ready(function(){
    $rootScope.camera = navigator.camera;
    $rootScope.file = cordova.file;
    $scope.hide();
   });


})

.controller('GaleryCtrl', function($rootScope) {

})

.controller('OptCtrl', function($rootScope) {

})
