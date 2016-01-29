/* global $ */
var appmodule = angular.module('QnA', ['ui.router', 'ngResource']);

appmodule.config(function($stateProvider, $urlRouterProvider) {
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
                },

            })
            .state('app.create-quiz', {
                url:'create/quiz/',
                views :{
                	'content@': {
                        controller  : 'CreateQuizController',
                        templateUrl : 'views/createquiz.html'
                    }
                }
                })
            .state('app.create-category', {
                url:'create/category/',
                views :{
                    'content@': {
                        controller  : 'CreateCategoryController',
                        templateUrl : 'views/createcategory.html'
                    }
                }
                })
            .state('app.questions', {
                url:'questions/',
                views :{
                    'content@': {
                        controller  : 'QuestionsController',
                        templateUrl : 'views/allquestions.html'
                    }
                }
                });

        // $urlRouterProvider.otherwise('/');
    });