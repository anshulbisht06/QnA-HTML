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
});