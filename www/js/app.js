// Ionic Starter App


(function($){
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

  })
})(jQuery);



// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('dash', {
      url: '/dash',
      abstract: true,
      templateUrl: 'templates/dash.html'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dash');

});
