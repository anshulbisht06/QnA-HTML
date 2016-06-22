/* global $ */
angular.module('QnA')
  .filter('capitalize', function() {
      return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      }
  })
  .filter('pagination', function()
  {
   return function(input, start)
   {
    start = +start;
    if(input){
    return input.slice(start);
    }
   };
   })

  .filter('time', function() {
    return function(input) {
      if(input < 60){
      	return '00:'+input;
      }
      else{
      	return parseInt(input/60)+':'+input%60;
      }
    }})

  .filter('insertBlank', function() {
      return function(input) {
        if(input!=undefined && input.indexOf("<<Answer>>")!=-1)
    		  return input.replace(/<<Answer>>/g, "____________"); 
        return input;
      }
  })

  .filter('unsafe', [ '$sce', function($sce) {
      return function(input) {
        if(input!=undefined && input.indexOf("**")!=-1)
          return $sce.trustAsHtml(input.replace(/\*\*/g, "<br>"));
        return $sce.trustAsHtml(input);
      }
  }])

  .filter('secondsToDateTime', function() {
      return function(seconds) {
          return new Date(1970, 0, 1).setSeconds(seconds);
      };
  });