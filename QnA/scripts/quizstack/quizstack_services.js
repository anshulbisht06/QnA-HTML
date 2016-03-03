/* global $ */

appmodule
    .constant('baseURL',baseURL)
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
                return data;
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
               for(i=0;i<data.length;i++){
                if(data[i].id===answerid){
                    data[i].isSelected = value;
                }else{
                    data[i].isSelected = false;
                }
               }
            }
        }]);
