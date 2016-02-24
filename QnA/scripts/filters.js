/* global $ */
angular.module('QnA').filter('levelFull', function() {
  return function(levelShort) {
  	var result = 'Unknown';	
  	try {
	    if(levelShort == 'E')
	    	result = 'Easy';
	    else if(levelShort == 'M')
	    	result = 'Medium';
	    else if(levelShort == 'H')
	    	result = 'Hard'; 
	    return result;
	}catch(err){
		return result;
	  };
	}
})

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.filter('insertBlank', function() {
    return function(input) {
      if(input!=undefined && input.indexOf("<>")!=-1)
  		return input.replace(/<>/g, "____________");    	
      return input;
    }
});