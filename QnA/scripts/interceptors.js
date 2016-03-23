
appmodule.factory('APIInterceptor', [ '$cookies', '$q', '$interval', function($cookies, $q, $interval){
	return {	
		    request: function(config) {
		    	$("#loader").css('display', 'block');
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
		    	$("#loader").css('display', 'none');
		      	return res;
		      	// return $q.reject(res);
		    },

		    responseError: function(res) {
		    	$("#loader").css('display', 'none');
		    	if(res.status <= 0) {
		    		var intial = 10;
		    		var time = intial;
                    angular.element(document.querySelector('#connectionLostModal')).modal('show');
                    $interval(function(){
	                    if(time === 0){
	                    	$.ajax({
		                      url : baseURL+"ping/",
		                      data : {},
		                      type : "GET",
		                      success : function(data) {
		                        angular.element(document.querySelector('#connectionLostModal')).modal('hide');
		                        alert('You are now connected to server');
		                      },
		                      error : function(xhr,errmsg,err) {
		                      	intial = intial + 5;
		                      	time = intial;
		                        angular.element(document.querySelector('#time')).text(time);
			                }
			            });
	                    }else{
		                    angular.element(document.querySelector('#time')).text(time);
	                	}
	                	time = time - 1;
	                },1000);
	            }
		      	return $q.reject(res);
		    }
			  }

}]);

appmodule.config(function($httpProvider) {
  	$httpProvider.interceptors.push('APIInterceptor');
});
