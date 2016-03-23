/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		// $httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        controller  : 'IndexController'
                    }
                    ,
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })

            .state('app.login-user', {
                url:'login/',
                views :{
                    'content@': {
                        controller  : 'LoginController',
                        templateUrl : 'views/login.html'
                    }
                }
                })

            .state('app.register-user', {
                url:'register/',
                views :{
                    'content@': {
                        controller  : 'UserRegisterController',
                        templateUrl : 'views/register.html'
                    }
                }
                })
		// $locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');
	});
