/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		// $httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.create-comprehension', {
                url:'comprehension/create/',
                views :{
                    'content@': {
                        controller  : 'CreateComprehensionController',
                        templateUrl : 'views/comprehension/create_comprehension.html'
                    }
                }
                })
            .state('app.add-comprehension-question', {
                url:'comprehension/add/question/:comprehensionId',
                views :{
                    'content@': {
                        controller  : 'CreateComprehensionQuestionController',
                        templateUrl : 'views/comprehension/add_comprehension_question.html'
                    }
                },
                params: {
                    obj: null
                    }
                })
            .state('app.list-comprehension-question', {
                url:'comprehension/list/questions/:comprehensionId',
                views :{
                    'content@': {
                        controller  : 'ListComprehensionQuestionsController',
                        templateUrl : 'views/comprehension/list_comprehension_questions.html'
                    }
                },
                params: {
                    obj: null
                    }
                })
            .state('app.update-comprehension-question', {
                url:'comprehension/update/question/:comprehensionQuestionId',
                views :{
                    'content@': {
                        controller  : 'UpdateComprehensionQuestionController',
                        templateUrl : 'views/comprehension/update_comprehension_questions.html'
                    }
                },
                params: {
                    obj: null
                    }
                })
            .state('app.update-comprehension-answers', {
                url:'comprehension/update/answers/:comprehensionQuestionId',
                views :{
                    'content@': {
                        controller  : 'UpdateComprehensionAnswersController',
                        templateUrl : 'views/comprehension/update_comprehension_answers.html'
                    }
                },
                params: {
                    obj: null
                    }
                });

	});
