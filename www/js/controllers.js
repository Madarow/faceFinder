angular.module('starter.controllers', [])

// $rootScope contain all cordova dependencies

.controller('HomeCtrl', function($scope,$rootScope,$ionicLoading,$ionicPopup,$timeout,facePlus) {

  $scope.mySelfie = {};
  $rootScope.imgs = [];

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

    if(localStorage.getItem('imgsList')){
      $rootScope.imgs = JSON.parse(localStorage.getItem('imgsList'));
      console.log($rootScope.imgs);
    }

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
        targetWidth:400,
        targetHeight:400,
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
      var repObj = JSON.parse(rep.response);

      if(rep.responseCode === 200){

        if(repObj.faces.length == 0){
          $scope.hide();
          $ionicPopup.alert({
            title: 'Ooups !!',
            template: 'no face detected !'
          });
          $scope.mySelfie = {};
        }else{
          var date = new Date;

          var img = {
            file:$scope.mySelfie,
            image_id:repObj.image_id,
            face:repObj.faces,
            d_day:date.getDate()
          }

          $rootScope.imgs.push(img);
          $rootScope.imgs.reverse();
          localStorage.removeItem('imgsList');
          localStorage.setItem('imgsList', JSON.stringify($scope.imgs));

          $scope.hide();
        }


      }else{
        $scope.hide();
        $scope.showAlert(rep)
      }
    })
  }

})

.controller('GaleryCtrl', function($rootScope,$scope) {
  $scope.imgs = $rootScope.imgs;
  console.log($scope.imgs);
})

.controller('OptCtrl', function($rootScope) {

})
