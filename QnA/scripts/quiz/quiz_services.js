/* global $ */

appmodule
    .service('QuizFactory', ['$resource', function($resource) { 
        this.createQuiz = function(){
                return $resource(baseURL+"quiz/create/", null,
                    {'save':   {method:'POST'}
                    },
                    { stripTrailingSlashes: false }
                    );
        };
        this.getAllQuiz = function(userid){
            return $resource(baseURL+"quiz/get/"+userid+"/all/", null,
                    {
                        query: {
                        // headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : true,
                        }
                    }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                    { stripTrailingSlashes: false }
                    );
        }
        this.getQuiz = function(userid, quizid){
            return $resource(baseURL+"quiz/get/"+userid+"/"+quizid+"/", null,
                    {
                        get: {
                        // headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : false,
                        }
                    },
                    { stripTrailingSlashes: false }
                    );
        }
        this.updateQuiz = function(userid, quizid){
            return $resource(baseURL+"quiz/update/"+userid+"/"+quizid+"/", null,
                    {'update':   
                    { method:'PUT'/*, headers: {'Authorization': 'JWT ' + token}*/} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
        this.deleteQuiz = function(userid, quizid){
            return $resource(baseURL+"quiz/delete/"+userid+"/"+quizid+"/", null,
                    {'delete':   
                    { method:'DELETE'/*, headers: {'Authorization': 'JWT ' + token}*/} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }]);


