/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		$httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.create-quiz', {
                url:'create/quiz/',
                views :{
                    'content@': {
                        controller  : 'CreateQuizController',
                        templateUrl : 'views/quiz/create_quiz.html'
                    }
                }
                })

            .state('app.all-quiz', {
                url:'quiz/all/',
                views :{
                    'content@': {
                        controller  : 'CreateQuizController',
                        templateUrl : 'views/quiz/all_quizzes.html'
                    }
                }
                })

            .state('app.update-quiz', {
                url:'quiz/:quizid',
                views :{
                    'content@': {
                        controller  : 'ViewUpdateQuizController',
                        templateUrl : 'views/quiz/view_update_quiz.html'
                    }
                }
                });
	});
