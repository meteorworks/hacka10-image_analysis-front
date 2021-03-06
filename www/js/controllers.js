angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicSlideBoxDelegate) {

  $scope.slideHasChanged = function(index){
    // アップロード画面はスワイプキャンセル
    if(index == 3 ){
      $ionicSlideBoxDelegate.enableSlide(false)
    }
  };

  $scope.nextSlide = function(next){
    $ionicSlideBoxDelegate.next();
  }

  var $uploadCrop;
  function popupResult(result) {

    var html;
    if (result.html) {
      html = result.html;
    }
    if (result.src) {
      html = '<img src="' + result.src + '" />';
    }
    swal({
      title: result.title || '',
      html: true,
      text: html,
      allowOutsideClick: true
    });
    //setTimeout(function(){
      //$('.sweet-alert').css('margin', function() {
      //  var top = -1 * ($(this).height() / 2),
      //    left = -1 * ($(this).width() / 2);
      //
      //  return -150 + 'px 0 0 ' + 0 + 'px';
      //});
    //}, 1);
  }

  $(function(){

    function readFile(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $uploadCrop.croppie('bind', {
            url: e.target.result
          });
          $('.upload-demo').addClass('ready');
        };

        reader.readAsDataURL(input.files[0]);
      }
      else if(!(window.File && window.FileReader && window.FileList && window.Blob)){
        swal("Sorry - you're browser doesn't support the FileReader API");
      }
    }

    $uploadCrop = $('#upload-demo').croppie({
      viewport: {
        width: 160,
        height: 160,
        type: 'circle'
      },
      boundary: {
        width: 260,
        height: 260
      },
      exif: true
    });

    $('#upload').on('change', function(){
      readFile(this);
    });

    $scope.isSearching =false;

    $scope.error = function(error){
      popupResult({
        title: "エラー",
        html: "<p>" + error
      });
    };

    $scope.uploadFish = function (ev) {

      $scope.isSearching = true;
      var errProc = $timeout(function(){
        if($scope.isSearching){
          $ionicLoading.hide();

          $scope.isSearching = false;
          $scope.error("");
        }
      }, 30 * 1000);

      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> 解析中...'
      });

      $uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport'
      }).then(function (data) {

        $timeout.cancel(errProc);

        socket.post('/question/', {
          cardId: $state.params.id || 100,
          answer: data
        }, function (resData) {

          console.log(resData);

          $ionicLoading.hide();

          if($scope.isSearching == false) return;

          if(resData==null){
            $scope.error("");
            return;
          }

          popupResult({
            title: resData.match ? "<img src='/img/oosakana-04.png' width='150' height='150' />" : "<img src='/img/oosakana-05.png' width='150' height='150' />",
            html: "<p>" + resData.target + "</p><p><img src='" + data + "' /></p>"
          });

        });
      });
    };

  });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
