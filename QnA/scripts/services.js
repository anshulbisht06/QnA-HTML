/* global $ */

appmodule
    .service('UserRegisterFactory',['$resource', function($resource) { 
        this.createUser = function(){
            return $resource(baseURL+"register/", null,
                    {'save':   
                    { method:'POST', 
                    } 
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
                    alert("All data uploaded successfully!");
               })            
               .error(function(data, status, headers, config){
                    alert("There is some problem with the file.Please fill according to the format.");
               });
            }
         }])

    // Use to when user try to take a review on quiz
    .service('quizReview', ['$http', function ($http) {
            
         }]);