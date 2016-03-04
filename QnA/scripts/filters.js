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
      if(input!=undefined && input.indexOf("<>")!=-1)
  		return input.replace(/<>/g, "____________");    	
      return input;
    }
})

.filter('secondsToDateTime', function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
})
.filter('attemptedQuestionsCount', function() {
    return function(object) {
    	var count = 0;
    	var totalKeys = 0;
        for(var key in object){
        	if(object[key]!=null && object[key]!=undefined){
        		count+=1;
        	}
        	totalKeys+=1;
        }
        return { percentage: (count*100)/totalKeys, count: count };
    };
})
.filter('notVisitedQuestionsCount', function() {
    return function(object) {
    	var count = 0;
    	var totalKeys = 0;
        for(var key in object){
        	if(object[key]===null){
        		count+=1;
        	}
        	totalKeys+=1;
        }
        return { percentage: (count*100)/totalKeys, count: count };
    };
})
.filter('notAttemptedQuestionsCount', function() {
    return function(object) {
    	var count = 0;
    	var totalKeys = 0;
        for(var key in object){
        	if(object[key]===undefined){
        		count+=1;
        	}
        	totalKeys+=1;
        }
        return { percentage: (count*100)/totalKeys, count: count.toString() };
    }
})
.filter('slice', function() {
  return function(array, start, end) {
    return array.slice(start, end);
  };
})
.filter('floor', function() {
    return function(input) {
        return Math.floor(input);
    };
});
