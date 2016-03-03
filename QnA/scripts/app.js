/* global $ */
var baseURL= 'http://localhost:8000/';

var appmodule = angular.module('QnA', ['ui.router', 'ngResource', 'ngCookies', 'ngFileUpload']);

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
                        templateUrl : 'views/create_quiz.html'
                    }
                }
                })

            .state('app.all-quiz', {
                url:'quiz/all/',
                views :{
                    'content@': {
                        controller  : 'CreateQuizController',
                        templateUrl : 'views/all_quizzes.html'
                    }
                }
                })

            .state('app.create-category', {
                url:'create/category/',
                views :{
                    'content@': {
                        controller  : 'CreateCategoryController',
                        templateUrl : 'views/create_category.html'
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
                        templateUrl : 'views/create_subcategory.html'
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
                        templateUrl : 'views/all_questions.html'
                    }
                }
                })
            .state('app.create-mcq-question', {
                url:'mcq/create/question/',
                views :{
                    'content@': {
                        controller  : 'CreateQuestionController',
                        templateUrl : 'views/create_mcq_question.html'
                    }
                }
                })
            .state('app.create-objective-question', {
                url:'objective/create/question/',
                views :{
                    'content@': {
                        controller  : 'CreateQuestionController',
                        templateUrl : 'views/create_objective_question.html'
                    }
                }
                })
            .state('app.update-question', {
                url:'update/question/:questionParams',
                views :{
                    'content@': {
                        controller  : 'UpdateQuestionController',
                        templateUrl : 'views/update_question.html'
                    }
                }
                })
            .state('app.update-answers', {
                url:'update/answers/:questionParams',
                views :{
                    'content@': {
                        controller  : 'UpdateAnswersController',
                        templateUrl : 'views/update_answers.html'
                    }
                }
                })
            .state('app.update-quiz', {
                url:'quiz/:quizid',
                views :{
                    'content@': {
                        controller  : 'ViewUpdateQuizController',
                        templateUrl : 'views/view_update_quiz.html'
                    }
                }
                })
            .state('app.view-quiz', {
                url:'quiz/:quizid/addstack/',
                views :{
                    'content@': {
                        controller  : 'AddQuizStackController',
                        templateUrl : 'views/add_quiz_stack.html'
                    }
                }
                })
            // .state('app.view-categories', {
            //     url:'quiz/:quizid/:categoryid/',
                // views :{
                //     'content@': {
                //         controller  : 'ViewQuizCategoriesController',
                //         templateUrl : 'views/viewcategories.html'
                //     }
                // }
            //     });
            .state('app.test-preview', {
                url:'test/preview/',
                views :{
                    'header@': {
                        controller  : 'TestPreviewHeaderController',
                        templateUrl : 'views/test_preview_header.html'
                    },
                    'content@': {
                        controller  : 'TestPreviewController',
                        templateUrl : 'views/test_preview.html'
                    },
                    'footer@': ''
                }
                })

        // $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
    });