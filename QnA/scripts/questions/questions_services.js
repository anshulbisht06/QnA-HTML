/* global $ */

appmodule
    .service('QuestionsFactory', ['$resource', '$http', function($resource, $http) {
        
        this.getAllQuestions = function(userid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestion = function(userid, questionid){
                return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                {
                    get: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderQuiz = function(userid, quizid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderCategory = function(userid, quizid, categoryid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderSubCategory = function(userId, subCategoryId, questionFormat){
                return $resource(baseURL+"quiz/questions/get/"+userId+"/", { 'questionFormat': questionFormat, 'subCategoryId' : subCategoryId},
                {
                    query: {
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.createQuestion = function(type, formData){ 
            return $resource(baseURL+"question/"+type+"/create/", formData,
                    {'save':   
                    { method:'POST', transformRequest: angular.identity, 
                    headers: {
                        /*'Authorization': 'JWT ' + token, */
                        'Content-Type': 'multipart/form-data'}
                     } 
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.updateQuestion = function(userid, questionid, que_type){
            return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', 
                    // headers: {'Authorization': 'JWT ' + token},
                     params : {'que_type': que_type}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.deleteQuestion = function(userid, questionid){
            return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                    {'delete':   
                    { method:'DELETE', 
                    // headers: {'Authorization': 'JWT ' + token}
                     } 
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAnswers = function(userid, questionid, que_type){
                return $resource(baseURL+"quiz/answers/"+userid+"/"+questionid+"/", null,
                {
                    get: {
                    // headers: {'Authorization': 'JWT ' + token},
                    params : {'que_type': que_type},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.updateAnswers = function(userid, questionid, que_type){
            return $resource(baseURL+"quiz/answers/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', 
                    // headers: {'Authorization': 'JWT ' + token},
                     params : {'que_type': que_type}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }]);



