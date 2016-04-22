appmodule.factory('APIInterceptor', [ '$cookies', '$q', '$interval', function($cookies, $q, $interval){
	return {	
		    request: function(config) {
		    	if($cookies.get('token')){
		    		config.headers.authorization = 'JWT '+$cookies.get('token');
		    	}
		    	else{
		    		// console.log('Please login first');	
		    	}
		     	return config;
		    },
		    requestError: function(config) {
		       	return config;
		    },

		    response: function(res) {
		      	return res;
		    },
		    responseError: function(res) {
		    	if(!isTimerOn){  // Very first fail request onTimer not all ...
		    		isTimerOn = true;
			    	if(res.status <= 0) {
			    		var call_count = 1;
	                    $('#connectionLostModal').show();
	                    $interval(function(){
	                    	if(time < 0){
	                    		return false;
	                    		$('#connectionLostModal').hide();
	                    	} 	
		                    else if(time === 0){
		                    	call_count = call_count+1
		                    	ping_fn(call_count);
		                    }else{
			                    $('#time').text(time);
		                	}
		                	time = time - 1;
		                },1000);
		            }
	        }
		      	return $q.reject(res);
		    }
			  }
}]);

appmodule.config(function($httpProvider) {
  	$httpProvider.interceptors.push('APIInterceptor');
});
