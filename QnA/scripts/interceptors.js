appmodule.factory('APIInterceptor', function($cookies){
	return {
	    request: function(config) {
	    	config.headers.authorization = 'JWT '+$cookies.get('token');
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