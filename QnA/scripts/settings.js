var baseURL= 'http://localhost:8000/';
var appmodule = angular.module('QnA', ['ui.router', 'ngResource', 'ngCookies', 'ngFileUpload']);
appmodule.factory('APIInterceptor', function($cookies){
	return {
			    request: function(config) {
			    	if($cookies.get('token')){
			    		config.headers.authorization = 'JWT '+$cookies.get('token');
			    	}
			     	else{
			     		console.log('No token avail ...');
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
