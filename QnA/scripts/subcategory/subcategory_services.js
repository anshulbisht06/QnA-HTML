/* global $ */

appmodule
    .service('SubCategoryFactory', ['$resource', function($resource) {
        this.createSubCategory = function(){
                return $resource(baseURL+"quiz/subcategory/create/", null,
                    {'save':   {method:'POST', 
                    // headers: {'Authorization': 'JWT ' + token}
                     }
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllSubcategories = function(userid, categoryid){
        return $resource(baseURL+"quiz/subcategory/get/"+userid+"/"+categoryid+"/", null,
            {
                query: {
                // headers: {'Authorization': 'JWT ' + token},
                method : 'GET',
                isArray : true,
                }
            },
            { stripTrailingSlashes: false }
            )
        };
    }]);


