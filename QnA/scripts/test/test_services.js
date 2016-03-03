angular.module('QnA')
.constant('baseURL',baseURL)

.service('testUserDataFactory', ['$resource', 'baseURL', function($resource, baseURL) {
	this.createSubCategory = function(data){
            return $resource(baseURL+"user/data/", null,
                    {'update':   
                    { method:'POST'/*, headers: {'Authorization': 'JWT ' + token}*/} 
                    },
                    { stripTrailingSlashes: false }
                    );
        };
        // this.createSubCategory = function(data){
        // 		var config = {
	       //          headers : {
	       //          }
	       //      };
        // 		return $http.post(baseURL+'user/data/',data, config)
		      //       .success(function(data, status, headers, config) {
		      //       	return data;
		      //     })
		      //       .error(function logoutErrorFn(data, status, headers, config) {
		      //       	console.error('Cannot logout!!!');
		      //       	return data;
		      //     })
        // };
    }])