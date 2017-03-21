angular.module('starter.controllers', [])

  // $rootScope contain all cordova dependencies

  .controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $ionicModal, $timeout, $state, facePlus) {

    $scope.mySelfie = {};
    $rootScope.imgs = [];
    $scope.opts = {};

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

    $scope.setOpts = function(){
      $ionicModal.fromTemplateUrl('./templates/option-modal.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modalOpts = modal;
          $scope.modalOpts.show();
      });
    }

    $scope.preparOpts = function(){
      $scope.modalOpts.hide();
      var attr = '';
      for(opt in $scope.opts){
        attr+=opt+',';
      }

      $scope.sendToApi(attr.substring(0, attr.length-1));
    }

    $scope.sendToApi = function(attr) {

      var options = {
        image_url: $scope.mySelfie.nativeURL,
        return_attributes: attr
      }
      /*show load popup*/
      $scope.show();

      facePlus.doDetect(options).then((rep) => {
        console.log(rep);
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

  .controller('GaleryCtrl', function($rootScope, $scope, $ionicPopup, facePlus) {

    $scope.imgs = $rootScope.imgs;
    $scope.comparList = $scope.imgs;





    $scope.sendToApiCompar = function() {

      var imgs = $scope.comparList.filter(function(elm) {
        return elm.select === true;
      });

      facePlus.doCompar(imgs);
    }

    $scope.removePicture = function(img){


      $scope.myPopup = $ionicPopup.show({
        template: 'Really ?!?',
        title: 'Remove the picture',
        subTitle: 'are you sure ?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Yes ! Do it !</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.imgs = $scope.imgs.filter(function(elm) {
                return elm.image_id != img.image_id;
              });

              window.resolveLocalFileSystemURL(img.file.nativeURL,function(fileEntry) {
                            fileEntry.remove(function(){
                              localStorage.removeItem('imgsList');
                              localStorage.setItem('imgsList', JSON.stringify($scope.imgs));
                              $scope.comparList = $scope.imgs;
                              $ionicPopup.alert({
                                title: 'Done !!',
                                template: 'Picture removed!'
                              });
                            },function(error){
                              $ionicPopup.alert({
                                title: 'Ouups !!',
                                template: error
                              });
                            },function(){
                               $ionicPopup.alert({
                                 title: 'Nope !!',
                                 template: 'No file ! like a spoon !'
                               });
                            });
                });

            }
          }
        ]
      });
    }

  })

  .controller('OptCtrl', function($rootScope, $scope, $ionicPopup, $ionicLoading) {

    $scope.removeAllPicture = function(){
      $ionicLoading.show({
        template: 'Removing...'
      });
      var path;
      for(img in $rootScope.imgs){
        path = $rootScope.imgs[img].file.nativeURL
        /*TODO remove all picture*/;
        window.resolveLocalFileSystemURL(path,function(fileEntry) {
                      fileEntry.remove(function(){
                          // The file has been removed succesfully
                          console.log('ok');
                      },function(error){
                          // Error deleting the file
                          console.log(error);
                      },function(){
                         // The file doesn't exist
                         console.log('no file');
                      });
        	});
      }
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Done !!',
        template: 'all pictures removed!'
      });
      localStorage.removeItem('imgsList');
    }

  })
