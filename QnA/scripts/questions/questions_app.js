/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		$httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.questions', {
                url:'questions/all/',
                views :{
                    'content@': {
                        controller  : 'QuestionsController',
                        templateUrl : 'views/questions/all_questions.html'
                    }
                }
                })
            .state('app.create-mcq-question', {
                url:'mcq/create/question/',
                views :{
                    'content@': {
                        controller  : 'CreateQuestionController',
                        templateUrl : 'views/questions/create_mcq_question.html'
                    }
                }
                })
            .state('app.create-objective-question', {
                url:'objective/create/question/',
                views :{
                    'content@': {
                        controller  : 'CreateQuestionController',
                        templateUrl : 'views/questions/create_objective_question.html'
                    }
                }
                })
            .state('app.update-question', {
                url:'update/question/:questionParams',
                views :{
                    'content@': {
                        controller  : 'UpdateQuestionController',
                        templateUrl : 'views/questions/update_question.html'
                    }
                }
                })
            .state('app.update-answers', {
                url:'update/answers/:questionParams',
                views :{
                    'content@': {
                        controller  : 'UpdateAnswersController',
                        templateUrl : 'views/questions/update_answers.html'
                    }
                }
                });
	});
