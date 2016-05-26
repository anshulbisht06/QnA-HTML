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
        this.getAllQuiz = function(_rest){
            return $resource(baseURL+"quiz/get/"+_rest[0]+"/all/", { hash: _rest[1] },
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
        this.getQuiz = function(_rest, quizid){
            return $resource(baseURL+"quiz/get/"+_rest[0]+"/"+quizid+"/", { hash: _rest[1] },
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
                    { method:'PUT'} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
        this.setQuizPublic = function(temp, quizid){
            return $resource(baseURL+"quiz/mark/public/"+temp[0]+"/"+quizid+"/", { hash: temp[1] },
                    {'update':   
                    { method:'PUT'}
                    },
                    { stripTrailingSlashes: false }
                    );
        }
        this.deleteQuiz = function(temp, quizid){
            return $resource(baseURL+"quiz/delete/"+temp[0]+"/"+quizid+"/", { hash: temp[1] },
                    {'delete':   
                    { method:'DELETE'/*, headers: {'Authorization': 'JWT ' + token}*/} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }]);


