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

        this.getAllSubcategories = function(user_id, category_id, all_subcategories){
        return $resource(baseURL+"quiz/subcategory/get/"+user_id+"/"+category_id+"/", { all_subcategories: all_subcategories },
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



