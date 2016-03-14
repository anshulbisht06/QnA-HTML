/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		// $httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.test-preview', {
                url:'test/preview/',
                views :{
                    'header@': {
                        controller  : 'TestPreviewHeaderController',
                        templateUrl : 'views/test/test_preview_header.html'
                    },
                    'content@': {
                        controller  : 'TestPreviewController',
                        templateUrl : 'views/test/test_preview.html'
                    },
                    'footer@': ''
                },
				params: {obj: null},
                })
		$urlRouterProvider.otherwise('/');
	});
