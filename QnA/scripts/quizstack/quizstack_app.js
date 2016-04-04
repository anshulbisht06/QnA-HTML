/* global $ */

appmodule
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		// $httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.view-quiz', {
                url:'quiz/:quizid/addstack/',
                views :{
                    'content@': {
                        controller  : 'AddQuizStackController',
                        templateUrl : 'views/quizstack/add_quiz_stack.html'
                    }
                }
                })
            .state('app.select-questions', {
                url:'quizstack/selectQs/:quizstackid',
                views :{
                    'content@': {
                        controller  : 'SelectQuestionsController',
                        templateUrl : 'views/quizstack/select_questions.html'
                    }
                },
                params: {
                        obj: null
                    }
                });
	});
