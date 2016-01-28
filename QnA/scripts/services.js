/* global $ */
angular.module('QnA')
    .constant("baseURL","http://localhost:8000/")
    .service('indexFactory', function() { 
        // this.introductionCarousel = ['images/bg.png', 'images/wedding.png', 'images/corporate-party.png'];
    })
    .service('createQuizFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
        this.createQuiz = function(){
                return $resource(baseURL+"quiz/create/", null,
                    {'save':   {method:'POST'} },
                    { stripTrailingSlashes: false }
                    );
        };
    }])
    .service('createCategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
        this.createCategory = function(){
                return $resource(baseURL+"quiz/create/category/", null,
                    {'save':   {method:'POST'} },
                    { stripTrailingSlashes: false }
                    );
        };
        this.createSubCategory = function(){
                return $resource(baseURL+"quiz/create/subcategory/", null,
                    {'save':   {method:'POST'} },
                    { stripTrailingSlashes: false }
                    );
        };

    }]);