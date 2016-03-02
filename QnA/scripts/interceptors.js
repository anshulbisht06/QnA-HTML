function testInterceptor() {
  return {
    request: function(config) {
    	console.log(config);
    	config.headers.authorization = 
     	return config;
    },

    requestError: function(config) {
    	console.log('Interceptor');
       	return config;
    },

    response: function(res) {
      	console.log('Interceptor');
      	return res;
    },

    responseError: function(res) {
      	console.log('Interceptor');
      	return res;
    }
  }
};