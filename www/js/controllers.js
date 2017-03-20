angular.module('starter.controllers', [])

// $rootScope contain all cordova dependencies

.controller('HomeCtrl', function($scope,$rootScope,$ionicLoading,$ionicPopup,$timeout,facePlus) {

  $scope.mySelfie = {};
  $scope.imgs = [];

  /*LOAD */

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.show();

  ionic.Platform.ready(function(){
    $rootScope.camera = navigator.camera;
    $rootScope.file = cordova.file;

    $scope.hide();
   });

/*GET PICTURE*/
$scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Ooups !!',
     template: error
   });
 };

  $scope.newPicture = function(){

    var options = {
        cameraDirection:$rootScope.camera.Direction.FRONT,
        saveToPhotoAlbum:true,
        targetWidth:200,
        targetHeight:200,
        correctOrientation:true
    };

    $rootScope.camera.getPicture($scope.newPictureSuccess,$scope.newPictureError,options)
  }

  $scope.newPictureSuccess = function(picture){
    // $scope.mySelfie =
    window.resolveLocalFileSystemURL(picture,function(success){
      console.log(success.nativeURL,success);
      $scope.$apply(function () {
        $scope.mySelfie = success
      })
    },function(error){
      $scope.showAlert(error);
    });
  }

  $scope.newPictureError = function(error){
    $scope.showAlert(error);
  }

  /*SEND PICTURE*/
  $scope.sendToApi = function(){

    var options = {
      image_url:$scope.mySelfie.nativeURL,
      return_attributes:"gender,age"
    }
    /*show load popup*/
    $scope.show();

    facePlus.doDetect(options).then((rep) => {

      if(rep.responseCode === 200){
        repObj = JSON.parse(rep.response);

        var img = {
          image_id:repObj.image_id,
          face:faces
        }
        $scope.imgs.push(img)
        $scope.hide();
      }else{
        $scope.hide();
        $scope.showAlert(rep)
      }
    })
  }

})

.controller('GaleryCtrl', function($rootScope) {

})

.controller('OptCtrl', function($rootScope) {

})
