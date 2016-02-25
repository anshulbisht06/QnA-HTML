/* global $ */

angular.module('QnA')
    .constant('baseURL',baseURL)
    .service('indexFactory', function() { 
        // this.introductionCarousel = ['images/bg.png', 'images/wedding.png', 'images/corporate-party.png'];
    })


    .service('UserRegisterFactory',['$resource', function($resource, baseURL) { 
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
            return $resource(baseURL+"quiz/get/"+userid+"/all/", null,
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
        this.getQuiz = function(token, userid, quizid){
            return $resource(baseURL+"quiz/detail/"+userid+"/"+quizid+"/", null,
                    {
                        get: {
                        headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : false,
                        }
                    },
                    { stripTrailingSlashes: false }
                    );
        }
        this.updateQuiz = function(token, userid, questionid){
            return $resource(baseURL+"quiz/update/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', headers: {'Authorization': 'JWT ' + token}} 
                    },
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

        this.getAllCategories = function(token, userid, categoryid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+categoryid+"/", null,
        {
            query: {
            headers: {'Authorization': 'JWT ' + token},
            method : 'GET',
            isArray : true,
            }
        },
        { stripTrailingSlashes: false }
        )};

        this.getCategory = function(token, userid, quizid, categoryid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
        {
            get: {
            headers: {'Authorization': 'JWT ' + token},
            method : 'GET',
            isArray : false,
            }
        },
        { stripTrailingSlashes: false }
        )};

        this.renameCategory = function(token){
            return $resource(baseURL+"quiz/category/rename/", null,
                    {'update':   
                    { method:'PUT', headers: {'Authorization': 'JWT ' + token}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    .service('SubCategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        this.createSubCategory = function(token){
                return $resource(baseURL+"quiz/subcategory/create/", null,
                    {'save':   {method:'POST', headers: {'Authorization': 'JWT ' + token} }
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllSubcategories = function(token, userid, categoryid){
        return $resource(baseURL+"quiz/subcategory/get/"+userid+"/"+categoryid+"/", null,
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
                    isArray : false,
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

        this.getQuestionUnderQuiz = function(token, userid, quizid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/", null,
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

        this.getQuestionUnderCategory = function(token, userid, quizid, categoryid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
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

        this.getQuestionUnderSubCategory = function(token, userId, subCategoryId, questionFormat){
                return $resource(baseURL+"quiz/questions/get/"+userId+"/", { 'questionFormat': questionFormat, 'subCategoryId' : subCategoryId},
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

        this.createQuestion = function(token, type){
            return $resource(baseURL+"question/"+type+"/create/", null,
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

    // Use this service for upload XLS file to create question's .. . 
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

    // Use to when user try to take a review on quiz
    .service('quizReview', ['$http', function ($http) {
            
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
         }])


    .service('QuizStackFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        selectedQuestions = [];
        this.addSelectedLevelQuestions = function(questionsLevelInfo){
            selectedQuestions.push(questionsLevelInfo); 
        }
        this.getSelectedLevelQuestions = function(index){
            return selectedQuestions[index];
        }
        finalStack = [];
        this.addToFinalStack  = function(value){
            finalStack.push(value);
        }
        this.getValueFromStack = function(index){
            return finalStack[index];
        }
        this.removeFromStack = function(index){
            delete finalStack[index];
        }
        // this.emptyFromStack = function(index){
        //     finalStack[index] = {};
        // }
        this.updateFinalStack = function(index, value){
            finalStack[index][index] = value;
        }
        this.showStack = function(){
            return finalStack;
        }

        // function to create an entry in QuizStack table.
        this.addToQuizStack = function(token){
            return $resource(baseURL+"stack/create/", null,
                {'save':   
                { method:'POST', headers: {'Authorization': 'JWT ' + token} } 
                },
                { stripTrailingSlashes: false }
                );
        }

        // function to fetch either all quiz stacks or with a specifid id.
        this.getQuizStack = function(token, quizid, quizstackid){
                return $resource(baseURL+"stack/get/"+quizid+"/"+quizstackid+"/", null,
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

        //function to remove existing quiz stack item (from backend also)
        this.deleteFromStack = function(token, quizid, quizstackid){
            return $resource(baseURL+"stack/delete/"+quizid+"/"+quizstackid+"/", null,
                {'delete':   
                { method:'DELETE', headers: {'Authorization': 'JWT ' + token} } 
                },
                { stripTrailingSlashes: false }
                );
        }
    }]);
