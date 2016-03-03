/* global $ */

appmodule
    .constant('baseURL',baseURL)
    .service('QuizFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
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
        this.updateQuiz = function(userid, questionid){
            return $resource(baseURL+"quiz/update/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT'/*, headers: {'Authorization': 'JWT ' + token}*/} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }]);


