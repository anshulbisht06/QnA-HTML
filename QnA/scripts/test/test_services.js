/* global $ */

appmodule
.constant('baseURL',baseURL)
.service('testUserDataFactory', ['$resource', 'baseURL', function($resource, baseURL) {
		this.createSubCategory = function(){
            return $resource(baseURL+"user/data/", null,
                    {'save':   
                    { method:'POST', 
                    } 
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
		      //     })
		      //       .error(function logoutErrorFn(data, status, headers, config) {
		      //       	console.error('Cannot logout!!!');
		      //     })

        // };
    }])