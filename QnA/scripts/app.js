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

            .state('app.all-quiz', {
                url:'quiz/all/',
                views :{
                    'content@': {
                        controller  : 'CreateQuizController',
                        templateUrl : 'views/allquizzes.html'
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
                },
                params: {
                        obj: null
                    }
                })
            .state('app.create-subcategory', {
                url:'create/subcategory/',
                views :{
                    'content@': {
                        controller  : 'CreateSubCategoryController',
                        templateUrl : 'views/createsubcategory.html'
                    }
                },
                params: {
                        obj: null
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
                })
            .state('app.update-question', {
                url:'update/question/:questionid',
                views :{
                    'content@': {
                        controller  : 'UpdateQuestionController',
                        templateUrl : 'views/updatequestion.html'
                    }
                }
                })
            .state('app.update-answers', {
                url:'update/answers/:questionid',
                views :{
                    'content@': {
                        controller  : 'UpdateAnswersController',
                        templateUrl : 'views/updateanswers.html'
                    }
                }
                })
            .state('app.view-quiz', {
                url:'quiz/:quizid',
                views :{
                    'content@': {
                        controller  : 'ViewUpdateQuizController',
                        templateUrl : 'views/viewupdatequiz.html'
                    }
                }
                })
            // .state('app.view-categories', {
            //     url:'quiz/:quizid/:categoryid/',
            //     views :{
            //         'content@': {
            //             controller  : 'ViewQuizCategoriesController',
            //             templateUrl : 'views/viewcategories.html'
            //         }
            //     }
            //     });


        // $locationProvider.html5Mode(true);   
        $urlRouterProvider.otherwise('/');
    });