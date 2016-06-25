/* global $ */

appmodule
    .service('QuizStackFactory', ['$resource', function($resource) {
            var selectedQuestions = [];
            var userSelectedQuestions = [];
            this.addSelectedLevelQuestions = function(questionsLevelInfo){
                selectedQuestions.push(questionsLevelInfo); 
            }
            this.getSelectedLevelQuestions = function(index){
                return selectedQuestions[index];
            }
            var finalStack = [];
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
                        isArray : false,
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
            };

            this.getQuizStackSelectedQuestions = function(quizstackid){
                return $resource(baseURL+"stack/filter/selectedQs/"+quizstackid+"/", null,
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

            this.postSelectedQuestions = function(quizstackid){
                return $resource(baseURL+"stack/filter/selectedQs/"+quizstackid+"/", null,
                    {
                        save: {
                        // headers: {'Authorization': 'JWT ' + token},
                        method : 'POST',
                        }
                    },
                    { stripTrailingSlashes: false }
                    );
            }
        }]);
