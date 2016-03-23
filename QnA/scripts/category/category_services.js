/* global $ */

appmodule
    .service('CategoryFactory', ['$resource', function($resource) {
        this.createCategory = function(){
                return $resource(baseURL+"quiz/category/create/", null,
                    {'save':   {
                        method:'POST',
                    }
                },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllCategories = function(userid, categoryid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+categoryid+"/", null,
        {
            query: {
            method : 'GET',
            isArray : true,
            }
        },
        { stripTrailingSlashes: false }
        )};

        this.getCategory = function(userid, quizid, categoryid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
        {
            get: {
            method : 'GET',
            isArray : false,
            }
        },
        { stripTrailingSlashes: false }
        )};

        this.renameCategory = function(){
            return $resource(baseURL+"quiz/category/rename/", null,
                    {'update':   
                    { method:'PUT', 
                } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }]);



