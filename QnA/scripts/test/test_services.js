angular.module('QnA')
.constant('baseURL',baseURL)

.service('testUserDataFactory', ['$http', 'baseURL', function($http, baseURL) {
        this.createSubCategory = function(data){
        		var config = {
	                headers : {
	                }
	            };
        		return $http.post(baseURL+'user/data/',data, config)
		            .success(function(data, status, headers, config) {
		          })
		            .error(function logoutErrorFn(data, status, headers, config) {
		            	console.error('Cannot logout!!!');
		          })
        };
    }])