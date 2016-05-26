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

        this.getAllSubcategories = function(temp, categoryId, allSubcategories){
            return $resource(baseURL+"quiz/subcategory/get/"+temp[0]+"/"+categoryId+"/", { all_subcategories: allSubcategories, hash: temp[1] },
                {
                    query: {
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                )
        };

        this.getQuestionUnderSubCategory = function(temp, subCategoryId, questionFormat){
            return $resource(baseURL+"quiz/questions/get/"+temp[0]+"/subcategory/"+subCategoryId+'/', 
                { questionFormat: false, subCategoryId : subCategoryId, hash: temp[1] },
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



