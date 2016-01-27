/* global $ */
angular.module('QnA')
    .constant("baseURL","http://localhost:8000/")
    .service('indexFactory', function() { 
        this.welcomeHeading = "Welcome to Qna - Online assessment engine for e-learners."; 
        // this.introductionCarousel = ['images/bg.png', 'images/wedding.png', 'images/corporate-party.png'];
    })
    .service('createQuizFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
        this.createquizmsg = "Please fill following fields";
        this.createQuiz = function(){
                // return $http.get(baseURL+"dishes");
                return $resource(baseURL+"quiz/list/", null, {'save':   {method:'POST'}});
        };
    }]);