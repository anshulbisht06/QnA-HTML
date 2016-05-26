/* global $ */

appmodule
    .service('QuestionsFactory', ['$resource', function($resource) {
        
        this.getAllQuestions = function(userid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/", null,
                {
                    query: {
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestion = function(temp, questionid){
                return $resource(baseURL+"quiz/question/"+temp[0]+"/"+questionid+"/", { hash:temp[1] },
                {
                    get: {
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
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderSubCategory = function(temp, subCategoryId, questionFormat){
                return $resource(baseURL+"quiz/questions/get/"+temp[0]+"/", { questionFormat: questionFormat, subCategoryId : subCategoryId, hash: temp[1] },
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
                     params : {'que_type': que_type}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.deleteQuestion = function(temp, questionid){
            return $resource(baseURL+"quiz/question/"+temp[0]+"/"+questionid+"/", { hash: temp[1] },
                    {'delete':   
                    { method:'DELETE', 
                     } 
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAnswers = function(temp, questionid, que_type){
                return $resource(baseURL+"quiz/answers/"+temp[0]+"/"+questionid+"/", { hash: temp[1] },
                {
                    get: {
                    params : {'que_type': que_type},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.updateAnswers = function(temp, questionid, que_type){
            return $resource(baseURL+"quiz/answers/"+temp[0]+"/"+questionid+"/", { hash: temp[1] },
                    {'update':   
                    { method:'PUT', 
                     params : {'que_type': que_type}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.getQuestionsBasedOnLevelAndQuestions = function(userId, subCategoryId, level, noofQuestions){
            return $resource(baseURL+"quiz/questions/get/"+userId+"/subcategory/"+subCategoryId+"/filters/",
                { level: level, no_of_questions: noofQuestions  },
                {
                    query: {
                    method : 'GET',
                    // isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        }
    }]);



