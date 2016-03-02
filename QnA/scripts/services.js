/* global $ */

angular.module('QnA')
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
    }])


    .service('SubCategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
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
    }])


    .service('QuestionsFactory', ['$resource', 'baseURL', '$http', function($resource, baseURL, $http) {
        this.getAllQuestions = function(userid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };


        this.getQuestion = function(userid, questionid){
                return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                {
                    get: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderQuiz = function(userid, quizid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderCategory = function(userid, quizid, categoryid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.getQuestionUnderSubCategory = function(userId, subCategoryId, questionFormat){
                return $resource(baseURL+"quiz/questions/get/"+userId+"/", { 'questionFormat': questionFormat, 'subCategoryId' : subCategoryId},
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        this.createQuestion = function(type, formData){ 
            return $resource(baseURL+"question/"+type+"/create/", formData,
                    {'save':   
                    { method:'POST', transformRequest: angular.identity, 
                    headers: {
                        /*'Authorization': 'JWT ' + token, */
                        'Content-Type': 'multipart/form-data'}
                     } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.updateQuestion = function(userid, questionid, que_type){
            return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', 
                    // headers: {'Authorization': 'JWT ' + token},
                     params : {'que_type': que_type}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.deleteQuestion = function(userid, questionid){
            return $resource(baseURL+"quiz/question/"+userid+"/"+questionid+"/", null,
                    {'delete':   
                    { method:'DELETE', 
                    // headers: {'Authorization': 'JWT ' + token}
                     } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }

        this.getAnswers = function(userid, questionid, que_type){
                return $resource(baseURL+"quiz/answers/"+userid+"/"+questionid+"/", null,
                {
                    get: {
                    // headers: {'Authorization': 'JWT ' + token},
                    params : {'que_type': que_type},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };
        this.updateAnswers = function(userid, questionid, que_type){
            return $resource(baseURL+"quiz/answers/"+userid+"/"+questionid+"/", null,
                    {'update':   
                    { method:'PUT', 
                    // headers: {'Authorization': 'JWT ' + token},
                     params : {'que_type': que_type}} 
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
            
         }])


    .service('QuizStackFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        var selectedQuestions = [];
        this.addSelectedLevelQuestions = function(questionsLevelInfo){
            selectedQuestions.push(questionsLevelInfo); 
        }
        this.getSelectedLevelQuestions = function(index){
            return selectedQuestions[index];
        }
        finalStack = [];
        this.addToFinalStack  = function(value){
            finalStack.push(value);
        }
        this.getValueFromStack = function(index){
            return finalStack[index];
        }
        this.removeFromStack = function(index){
            delete finalStack[index];
        }
        // this.emptyFromStack = function(index){
        //     finalStack[index] = {};
        // }
        this.updateFinalStack = function(index, value){
            finalStack[index][index] = value;
        }
        this.showStack = function(){
            return finalStack;
        }

        // function to create an entry in QuizStack table.
        this.addToQuizStack = function(){
            return $resource(baseURL+"stack/create/", null,
                {'save':   
                { method:'POST', 
                // headers: {'Authorization': 'JWT ' + token}
                 } 
                },
                { stripTrailingSlashes: false }
                );
        }

        // function to fetch either all quiz stacks or with a specifid id.
        this.getQuizStack = function(quizid, quizstackid){
                return $resource(baseURL+"stack/get/"+quizid+"/"+quizstackid+"/", null,
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : true,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };

        //function to remove existing quiz stack item (from backend also)
        this.deleteFromStack = function(quizid, quizstackid){
            return $resource(baseURL+"stack/delete/"+quizid+"/"+quizstackid+"/", null,
                {'delete':   
                { method:'DELETE', 
                // headers: {'Authorization': 'JWT ' + token}
                 } 
                },
                { stripTrailingSlashes: false }
                );
        }
    }])
    .service('TestPreviewFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        var allQuestions = {}
        this.getQuestionsBasedOnSection = function(quizid, sectionName){
            return $resource(baseURL+"stack/get/questions/"+quizid+"/", { sectionName: sectionName},
                {
                    query: {
                    // headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        }
        this.addQuestionsForSection = function(sectionName, data){
            allQuestions[sectionName] = data;
        }
        this.getQuestionsForASection = function(sectionName){
            return allQuestions[sectionName];
        }
        this.showAllQuestionsAdded = function(){
            return allQuestions;
        }
        this.getAQuestion = function(sectionName, count){
            return allQuestions[sectionName][count-1][count];
        }
        this.saveOrChangeAnswer = function(sectionName, count, answerid, value){
           var data = allQuestions[sectionName][count-1][count]['options'];
           console.log(data);
           for(i=0;i<data.length;i++){
            if(data[i].id===answerid){
                data[i].isSelected = value;
                console.log(i);
            }else{
                data[i].isSelected = false;
                console.log(i,'9999');
            }
           }
           console.log(allQuestions[sectionName][count-1][count]['options']);
        }
    }]);
