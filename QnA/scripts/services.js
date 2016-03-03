/* global $ */

appmodule
    .constant('baseURL',baseURL)
    .service('indexFactory', function() { 
        // this.introductionCarousel = ['images/bg.png', 'images/wedding.png', 'images/corporate-party.png'];
    })


    .service('UserRegisterFactory',['$resource', function($resource, baseURL) { 
        this.createUser = function(){
            return $resource(baseURL+"register/", null,
                    {'save':   
                    { method:'POST', 
                    // headers: {'Authorization': 'JWT ' + token} 
                    } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    .service('QuizFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
        this.createQuiz = function(){
                return $resource(baseURL+"quiz/create/", null,
                    {'save':   {method:'POST'}
                    },
                    { stripTrailingSlashes: false }
                    );
        };
        this.getAllQuiz = function(userid){
            return $resource(baseURL+"quiz/get/"+userid+"/all/", null,
                    {
                        query: {
                        // headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : true,
                        }
                    }                                                                                                                                                                                                                                                                                                                                                                                                             ,
                    { stripTrailingSlashes: false }
                    );
        }
        this.getQuiz = function(userid, quizid){
            return $resource(baseURL+"quiz/get/"+userid+"/"+quizid+"/", null,
                    {
                        get: {
                        // headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : false,
                        }
                    },
                    { stripTrailingSlashes: false }
                    );
        }
        this.updateQuiz = function(userid, questionid){
            return $resource(baseURL+"quiz/update/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT'/*, headers: {'Authorization': 'JWT ' + token}*/} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    // Use this service for upload XLS file to create question's .. . 
    .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  // headers: {'Content-Type': undefined, 'Authorization': 'JWT ' + token}
               })            
               .success(function(data, status, headers, config){
                    alert("All questions uploaded successfully!");
               })            
               .error(function(data, status, headers, config){
                    alert("There is some problem with the file.Please fill according to the format.");
               });
            }
         }])

    // Use to when user try to take a review on quiz
    .service('quizReview', ['$http', function ($http) {
            
         }]);