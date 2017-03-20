angular.module('starter.controllers', [])

  // $rootScope contain all cordova dependencies

  .controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $timeout, $state, facePlus) {

    $scope.mySelfie = {};
    $rootScope.imgs = [];

    /*LOAD */

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };

    $scope.hide = function() {
      $ionicLoading.hide();
    };

    $scope.show();

    ionic.Platform.ready(function() {
      $rootScope.camera = navigator.camera;
      $rootScope.file = cordova.file;

      if (localStorage.getItem('imgsList')) {
        $rootScope.imgs = JSON.parse(localStorage.getItem('imgsList'));
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

    $scope.newPicture = function() {

      var options = {
        cameraDirection: $rootScope.camera.Direction.FRONT,
        saveToPhotoAlbum: true,
        targetWidth: 400,
        targetHeight: 400,
        correctOrientation: true,
        quality: 100
      };

      $rootScope.camera.getPicture($scope.newPictureSuccess, $scope.newPictureError, options)
    }

    $scope.newPictureSuccess = function(picture) {
      window.resolveLocalFileSystemURL(picture, function(success) {
        $scope.$apply(function() {
          $scope.mySelfie = success
        })
      }, function(error) {
        $scope.showAlert(error);
      });
    }

    $scope.newPictureError = function(error) {
      $scope.showAlert(error);
    }

    /*SEND PICTURE*/
    $scope.sendToApi = function() {
      var options = {
        image_url: $scope.mySelfie.nativeURL,
        return_attributes: "gender,age"
      }
      /*show load popup*/
      $scope.show();

      facePlus.doDetect(options).then((rep) => {
        console.log(rep.response);
        var repObj = JSON.parse(rep.response);

        if (rep.responseCode === 200) {

          if (repObj.faces.length == 0) {
            $scope.hide();
            $ionicPopup.alert({
              title: 'Ooups !!',
              template: 'no face detected !'
            });
            $scope.mySelfie = {};
          } else {
            var date = new Date;

            var img = {
              file: $scope.mySelfie,
              image_id: repObj.image_id,
              face: repObj.faces,
              d_day: date.getDate()
            }

            $rootScope.imgs.unshift(img);
            localStorage.removeItem('imgsList');
            localStorage.setItem('imgsList', JSON.stringify($scope.imgs));

            $scope.hide();
            $scope.mySelfie = {};

            $state.go('tab.gallery');
          }

        } else {
          $scope.hide();
          $scope.showAlert(rep)
        }
      })
    }

    $scope.haveImg = function() {
      return $scope.mySelfie.nativeURL === undefined;
    }
  })

  .controller('GaleryCtrl', function($rootScope, $scope, facePlus) {
    $scope.imgs = $rootScope.imgs;
    $scope.comparList = $scope.imgs;


    $scope.sendToApiCompar = function() {

      var imgs = $scope.comparList.filter(function(elm) {
        return elm.select === true;
      });

      facePlus.doCompar(imgs);
    }

  })

  .controller('OptCtrl', function($rootScope) {

  })
