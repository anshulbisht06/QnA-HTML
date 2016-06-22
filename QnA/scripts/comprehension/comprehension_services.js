/* global $ */

appmodule
    .service('ComprehensionFactory', ['$resource', function($resource) {
    	this.createComprehension = function(type, formData){ 
            return $resource(baseURL+"comprehension/create/", formData,
                {'save':   
                    { method:'POST', transformRequest: angular.identity, 
                        headers: {
                            'Content-Type': 'multipart/form-data'}
                    } 
                },
                    { stripTrailingSlashes: false }
            );
        };

        this.getComprehension = function(temp, comprehensionId){ 
            return $resource(baseURL+"question/comprehension/get/"+comprehensionId+"/", { hash:temp[1], user:temp[0] },
                {
                    query: {
                        method : 'GET',
                        isArray : true,
                        // cache : true,
                    }
                }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                { stripTrailingSlashes: false }
            );
        };

        this.getComprehensionQuestions = function(temp, comprehensionId){
            return $resource(baseURL+"question/comprehension/get/questions/"+comprehensionId+"/", { hash:temp[1], user:temp[0] },
                {
                    query: {
                        method : 'GET',
                        isArray : false,
                        // cache : true,
                    }
                }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                { stripTrailingSlashes: false }
            );
        };

        this.deleteComprehensionQuestion = function(temp, comprehensionQuestionId){
            return $resource(baseURL+"question/comprehension/operations/"+comprehensionQuestionId+"/", { hash:temp[1], user:temp[0] },
                {'delete':   
                    { method:'DELETE', 
                    } 
                },
                { stripTrailingSlashes: false }
            );
        };

        this.getComprehensionQuestion = function(temp, comprehensionQuestionId){ 
            return $resource(baseURL+"question/comprehension/operations/"+comprehensionQuestionId+"/", { hash:temp[1], user:temp[0] },
                {
                    query: {
                        method : 'GET',
                        isArray : true,
                        // cache : true,
                    }
                }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                { stripTrailingSlashes: false }
            );
        };

        this.getComprehensionAnswers = function(temp, comprehensionQuestionId){
            return $resource(baseURL+"question/comprehension/answers/operations/"+comprehensionQuestionId+"/", { hash:temp[1], user:temp[0] },
            {
                get: {
                    method : 'GET',
                    isArray : false,
                    // cache : true,
                }
            },
            { stripTrailingSlashes: false }
            );
        };

        this.updateComprehensionAnswers = function(temp, comprehensionQuestionId){
            return $resource(baseURL+"question/comprehension/answers/operations/"+comprehensionQuestionId+"/", { hash:temp[1], user:temp[0] },
                {'update':   
                    { method:'PUT'} 
                },
                { stripTrailingSlashes: false }
                );
    }
    }]);