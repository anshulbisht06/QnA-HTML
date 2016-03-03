appmodule.factory('APIInterceptor', function($cookies){
	return {	
		    request: function(config) {
		    	if($cookies.get('token')){
		    		config.headers.authorization = 'JWT '+$cookies.get('token');
		    	}
		    	else{
		    		console.log('Please login first');	
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
		      	return res;
		    }
			  }

});

appmodule.config(function($httpProvider) {
  		$httpProvider.interceptors.push('APIInterceptor');
	});