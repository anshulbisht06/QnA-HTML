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

        this.getComprehension = function(comprehensionId){ 
            return $resource(baseURL+"question/comprehension/get/"+comprehensionId+"/", null,
                {
                    query: {
                        method : 'GET',
                        isArray : true,
                    }
                }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                { stripTrailingSlashes: false }
            );
        };

        this.getComprehensionQuestions = function(comprehensionId){ 
            return $resource(baseURL+"question/comprehension/get/questions/"+comprehensionId+"/", null,
                {
                    query: {
                        method : 'GET',
                        isArray : false,
                    }
                }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                { stripTrailingSlashes: false }
            );
        };

        this.deleteComprehensionQuestion = function(comprehensionQuestionId){
            return $resource(baseURL+"question/comprehension/operations/"+comprehensionQuestionId+"/", null,
                {'delete':   
                    { method:'DELETE', 
                    } 
                },
                { stripTrailingSlashes: false }
            );
        };

        this.getComprehensionQuestion = function(comprehensionQuestionId){ 
            return $resource(baseURL+"question/comprehension/operations/"+comprehensionQuestionId+"/", null,
                {
                    query: {
                        method : 'GET',
                        isArray : true,
                    }
                }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                { stripTrailingSlashes: false }
            );
        };

        this.getComprehensionAnswers = function(comprehensionQuestionId){
            return $resource(baseURL+"question/comprehension/answers/operations/"+comprehensionQuestionId+"/", null,
            {
                get: {
                    method : 'GET',
                    isArray : false,
                }
            },
            { stripTrailingSlashes: false }
            );
        };

        this.updateComprehensionAnswers = function(comprehensionQuestionId){
            return $resource(baseURL+"question/comprehension/answers/operations/"+comprehensionQuestionId+"/", null,
                {'update':   
                    { method:'PUT'} 
                },
                { stripTrailingSlashes: false }
                );
    }
    }]);