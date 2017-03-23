angular.module('starter.controllers', [])

  .controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $ionicModal, $timeout, $state, facePlus) {

    $scope.mySelfie = {};

    $rootScope.imgs = [];

    /*send options */
    $scope.opts = {
      age: false,
      ethnicity: false,
      gender: false,
      smiling: false,
    };

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

    /*device ready*/

    ionic.Platform.ready(function() {

      $rootScope.camera = navigator.camera;
      $rootScope.file = cordova.file;

      if (localStorage.getItem('imgsList')) {
        $rootScope.imgs = JSON.parse(localStorage.getItem('imgsList'));
        var date = new Date;
        $rootScope.imgs = $rootScope.imgs.filter(function(elm){

          if(elm.d_day + 3 >= date.getDate()){
            return elm
          }else{
            if(!elm.isGalleryImg){
              window.resolveLocalFileSystemURL(elm.file.nativeURL, function(fileEntry) {
                fileEntry.remove(function() {
                  $ionicPopup.alert({
                    title: 'Old image !!',
                    template: 'Remove !'
                  });
                }, function(error) {
                  $ionicPopup.alert({
                    title: 'Ouups !!',
                    template: error
                  });
                }, function() {
                  $ionicPopup.alert({
                    title: 'Nope !!',
                    template: 'No file !'
                  });
                });
              });
            }
          }
        })
      }
      console.log($rootScope.imgs);
      $scope.hide();

    });

    /*GET PICTURE*/

    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Ooups !!',
        template: error
      });
    };

    /*picture from gallery*/
    $scope.getImageFromFiles = function() {

    var options = {
             quality         : 75,
             destinationType : Camera.DestinationType.DATA_URI,
             sourceType      : Camera.PictureSourceType.PHOTOLIBRARY,
             encodingType    : Camera.EncodingType.JPEG,
             targetWidth     : 400,
             targetHeight    : 400,
             popoverOptions  : CameraPopoverOptions,
             saveToPhotoAlbum: false,
             correctOrientation: true
         };

      $rootScope.camera.getPicture(function(r) {
        $scope.$apply(function() {
          $scope.mySelfie.isGalleryImg = true
          $scope.mySelfie.nativeURL = r
        })

      }, function(error) {

        $ionicPopup.alert({
          title: 'Ooups !!',
          template: error
        });

      }, options)

    }
    /*pictures from camera*/
    $scope.newPicture = function() {

      var options = {
        cameraDirection: $rootScope.camera.Direction.FRONT,
        saveToPhotoAlbum: false,
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

    $scope.setOpts = function() {

      $ionicModal.fromTemplateUrl('./templates/option-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {

        $scope.modalOpts = modal;
        $scope.modalOpts.show();

      });
    }

    $scope.preparOpts = function() {

      $scope.modalOpts.hide();
      var attr = '';

      for (opt in $scope.opts) {

        if (opt !== 'all')
          attr += opt + ',';

      }
      $scope.sendToApi(attr.substring(0, attr.length - 1));
    }

    $scope.sendToApi = function(attr) {

      var options = {
        image_url: $scope.mySelfie.nativeURL,
        return_attributes: attr
      }

      /*show load popup*/
      $scope.show();

      facePlus.doDetect(options).then((rep) => {

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
            console.log($scope.mySelfie);
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
          rep = rep.http_status == 413 ? '{"error":"error"}' : rep
          $scope.hide();
          $scope.showAlert(rep)
        }
      })
    }

    /* template function*/
    $scope.haveImg = function() {
      return $scope.mySelfie.nativeURL === undefined;
    }

    $scope.removeActivePicture = function() {
      $scope.mySelfie = {};
    }

    $scope.toogleOpts = function() {

      $scope.opts.age = $scope.opts.all
      $scope.opts.ethnicity = $scope.opts.all
      $scope.opts.gender = $scope.opts.all
      $scope.opts.smiling = $scope.opts.all

    }

  })

  .controller('GaleryCtrl', function($rootScope, $scope, $ionicPopup, $ionicLoading, facePlus) {

    $scope.imgs = $rootScope.imgs;
    $scope.comparList = [];
    /*COMPARE PIX*/
    $scope.imgSelected = function(face) {

        if(face.select == true){
          $scope.comparList.push(face);
        }else{
          $scope.comparList = $scope.comparList.filter(function(face){
            return face.face_token !== face.face_token
          })
        }


      if ($scope.comparList.length == 2) {

        $ionicLoading.show({
          template: 'Loading...'
        });

        facePlus.doCompar($scope.comparList).then((r) => {
          if (r.status == 200) {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Done !!',
              template: 'confidence : ' + r.data.confidence + '%'
            });

            for (i = 0; i < 2; i++) {
              $scope.comparList[i].select = false
            }

            $scope.comparList.length = 0;
          } else {

            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'An error occured !!',
              template: 'Please try again'
            });

          }
        });

      }
    }


    $scope.removePicture = function(img) {

        $scope.myPopup = $ionicPopup.show({
          template: 'Really ?!?',
          title: 'Remove the picture',
          subTitle: 'are you sure ?',
          scope: $scope,
          buttons: [{
              text: 'Cancel'
            },
            {
              text: '<b>Yes ! Do it !</b>',
              type: 'button-positive',
              onTap: function(e) {
                $scope.imgs = $scope.imgs.filter(function(elm) {
                  return elm.image_id != img.image_id;
                });

                /*out of callback for images coming from gallery*/
                $rootScope.imgs = {};
                localStorage.removeItem('imgsList');
                localStorage.setItem('imgsList', JSON.stringify($scope.imgs));
                $rootScope.imgs = $scope.imgs;
                $scope.comparList = $scope.imgs;
                $rootScope.imgs = $scope.imgs;

                window.resolveLocalFileSystemURL(img.file.nativeURL, function(fileEntry) {
                  fileEntry.remove(function() {
                    $ionicPopup.alert({
                      title: 'Done !!',
                      template: 'Picture removed!'
                    });
                  }, function(error) {
                    $ionicPopup.alert({
                      title: 'Ouups !!',
                      template: error
                    });
                  }, function() {
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

      $scope.getNumberOfImages = function() {
        return $scope.imgs.length > 0;
      }
  })

  .controller('OptCtrl', function($rootScope, $scope, $ionicPopup, $ionicLoading) {

    $scope.removeAllPicture = function() {
      $ionicLoading.show({
        template: 'Removing...'
      });
      var path;
      for (img in $rootScope.imgs) {
        path = $rootScope.imgs[img].file.nativeURL;

        if(!img.isGalleryImg){
          window.resolveLocalFileSystemURL(path, function(fileEntry) {
            fileEntry.remove(function() {
              console.log('ok');
            }, function(error) {
              $ionicPopup.alert({
                title: 'Oops !!',
                template: error
              });
            }, function() {
              $ionicPopup.alert({
                title: 'Oops !!',
                template: 'file doesn\'t exist (like a spoon) !'
              });
            });
          });
        }

      }

      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Done !!',
        template: 'all pictures removed!'
      });
      $rootScope.imgs.length = 0;
      localStorage.removeItem('imgsList');
    }
  })
