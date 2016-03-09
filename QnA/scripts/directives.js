appmodule.directive('test-window-exit', function($window) {
  return {
    restrict: 'A',
    link: function(element, attrs){
       var event = $window.attachEvent || $window.addEventListener,
       checkEvent = $window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatible
       event(checkEvent, function (e) { // For >= IE7, Chrome, Firefox
           var confirmationMessage = ' ';
           (e || $window.event).returnValue = "Are you sure that you'd like to close the browser ?";
           return confirmationMessage;
       });
    }
  };
})