/* global $ */

appmodule
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		$httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.view-quiz', {
                url:'quiz/:quizid/addstack/',
                views :{
                    'content@': {
                        controller  : 'AddQuizStackController',
                        templateUrl : 'views/quizstack/add_quiz_stack.html'
                    }
                }
                });
	});
