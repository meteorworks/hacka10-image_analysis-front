angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicSlideBoxDelegate) {

  $scope.slideHasChanged = function(index){
    if(index == 3 ){
      console.log(index);

      $ionicSlideBoxDelegate.enableSlide(false)
    }
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
      title: '',
      html: true,
      text: html,
      allowOutsideClick: true
    });
    setTimeout(function(){
      $('.sweet-alert').css('margin', function() {
        var top = -1 * ($(this).height() / 2),
          left = -1 * ($(this).width() / 2);

        return -150 + 'px 0 0 ' + 0 + 'px';
      });
    }, 1);
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
        width: 200,
        height: 200,
        type: 'circle'
      },
      boundary: {
        width: 320,
        height: 320
      },
      exif: true
    });

    $('#upload').on('change', function(){
      readFile(this);
    });

    $('.upload-result').on('click', function (ev) {

      $uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport'
      }).then(function (data) {


        return  popupResult({
          html: "<h1>スコア: " + 10 + "</h1>"
        });

        socket.post('/question/', {
          id: 1,
          answer: data
        }, function (resData) {
          console.log(resData);
          popupResult({
            html: "<h1>スコア: " + resData.score + "</h1>"
          });
        });
      });
    });

  });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
