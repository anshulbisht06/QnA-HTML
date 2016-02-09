/* global $ */

angular.module('QnA')
    .constant('baseURL',baseURL)
    .service('indexFactory', function() { 
        // this.introductionCarousel = ['images/bg.png', 'images/wedding.png', 'images/corporate-party.png'];
    })


    .service('UserRegisterFactory',['$resource', 'config', function($resource, baseURL) { 
        this.createUser = function(token){
            return $resource(baseURL+"register/", null,
                    {'save':   
                    { method:'POST', headers: {'Authorization': 'JWT ' + token} } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    .service('QuizFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
        this.createQuiz = function(token){
                return $resource(baseURL+"quiz/create/", null,
                    {'save':   {method:'POST', headers: {'Authorization': 'JWT ' + token} }
                    },
                    { stripTrailingSlashes: false }
                    );
        };
        this.getAllQuiz = function(token, userid){
            return $resource(baseURL+"quiz/get/"+userid+"/quiz/", null,
                    {
                        query: {
                        headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : true,
                        }
                    }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    .service('CategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        this.createCategory = function(token){
                return $resource(baseURL+"quiz/category/create/", null,
                    {'save':   {
                        method:'POST',
                        headers: {'Authorization': 'JWT ' + token}
                    }
                },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllCategories = function(token, userid, quizid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+quizid+"/", null,
        {
            query: {
            headers: {'Authorization': 'JWT ' + token},
            method : 'GET',
            isArray : true,
            }
        },
        { stripTrailingSlashes: false }
        )};
    }])


    .service('SubCategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        this.createSubCategory = function(token){
                return $resource(baseURL+"quiz/subcategory/create/", null,
                    {'save':   {method:'POST', headers: {'Authorization': 'JWT ' + token} }
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllSubcategories = function(token, userid, quizid, categoryid){
        return $resource(baseURL+"quiz/subcategory/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
            {
                query: {
                headers: {'Authorization': 'JWT ' + token},
                method : 'GET',
                isArray : true,
                }
            },
            { stripTrailingSlashes: false }
            )
        };
    }])


    .service('QuestionsFactory', ['$resource', 'baseURL', '$http', function($resource, baseURL, $http) {
        this.getAllQuestions = function(token, userid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/", null,
                {
                    query: {
                    headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };


        this.getQuestion = function(token, userid, questionid){
                return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                {
                    get: {
                    headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.createQuestion = function(token){
            return $resource(baseURL+"question/mcq/create/", null,
                    {'save':   
                    { method:'POST', headers: {'Authorization': 'JWT ' + token}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.updateQuestion = function(token, userid, questionid){
            return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', headers: {'Authorization': 'JWT ' + token}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.deleteQuestion = function(token, userid, questionid){
            return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                    {'delete':   
                    { method:'DELETE', headers: {'Authorization': 'JWT ' + token}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.getAnswers = function(token, userid, questionid){
                return $resource(baseURL+"quiz/answers/"+userid+"/"+questionid+"/", null,
                {
                    get: {
                    headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };
        this.updateAnswers = function(token, userid, questionid){
            return $resource(baseURL+"quiz/answers/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', headers: {'Authorization': 'JWT ' + token}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])

    
    .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(){
               })
            
               .error(function(){
               });
            }
         }])

    .directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);