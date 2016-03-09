/* global $ */

appmodule
    .service('SubCategoryFactory', ['$resource', function($resource) {
        this.createSubCategory = function(){
                return $resource(baseURL+"quiz/subcategory/create/", null,
                    {'save':   {method:'POST', 
                     }
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllSubcategories = function(userid, categoryid){
        return $resource(baseURL+"quiz/subcategory/get/"+userid+"/"+categoryid+"/", null,
            {
                query: {
                method : 'GET',
                isArray : true,
                }
            },
            { stripTrailingSlashes: false }
            )
        };

        this.getQuestionUnderSubCategory = function(userId, subCategoryId, questionFormat){
                return $resource(baseURL+"quiz/questions/get/"+userId+"/subcategory/"+subCategoryId+'/', 
                    { 'questionFormat': false, 'subCategoryId' : subCategoryId},
                {
                    query: {
                    method : 'GET',
                    // isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

    }]);



