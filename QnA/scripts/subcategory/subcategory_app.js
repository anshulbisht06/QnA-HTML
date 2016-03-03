/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		// $httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.create-subcategory', {
                url:'create/subcategory/',
                views :{
                    'content@': {
                        controller  : 'CreateSubCategoryController',
                        templateUrl : 'views/subcategory/create_subcategory.html'
                    }
                },
                params: {
                        obj: null
                    }
                });
	});
