/* global $ */
var appmodule = angular.module('QnA', ['ui.router', 'ngResource', 'ngCookies']);

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
                url:'questions/all/',
                views :{
                    'content@': {
                        controller  : 'QuestionsController',
                        templateUrl : 'views/allquestions.html'
                    }
                }
                })
            .state('app.create-question', {
                url:'create/question/',
                views :{
                    'content@': {
                        controller  : 'CreateQuestionController',
                        templateUrl : 'views/createquestion.html'
                    }
                }
                });

        // $locationProvider.html5Mode(true);   
        $urlRouterProvider.otherwise('/');
    });