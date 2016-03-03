/* global $ */

appmodule
    .constant('baseURL',baseURL)
    .service('CategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        this.createCategory = function(){
                return $resource(baseURL+"quiz/category/create/", null,
                    {'save':   {
                        method:'POST',
                        // headers: {'Authorization': 'JWT ' + token}
                    }
                },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllCategories = function(userid, categoryid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+categoryid+"/", null,
        {
            query: {
            // headers: {'Authorization': 'JWT ' + token},
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
            // headers: {'Authorization': 'JWT ' + token},
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
                    // headers: {'Authorization': 'JWT ' + token}
                } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }]);



