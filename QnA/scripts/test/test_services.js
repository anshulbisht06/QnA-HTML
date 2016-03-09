/* global $ */

appmodule
	.service('testUserDataFactory', ['$resource', function($resource) {
		this.saveTestUser = function(){
	        return $resource(baseURL+"user/data/", null,
	                {'save':   
	                { method:'POST', 
	                } 
	                },
	                { stripTrailingSlashes: false }
	                );
	    };	    
	}])

	.service('TestPreviewFactory', ['$resource', function($resource) {
        var allQuestions = {}
        var progressData = {}
        var data = {};
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
        this.saveProgressValues = function(sectionName, data){
            progressData[sectionName] = data;
        }
        this.getProgressValues = function(){
            return progressData;
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
        // Show all questions answered with section name as key
        this.showAllQuestionsAnswered = function(){
            data['progressValues'] = this.getProgressValues();
            return data;
        }

        // Save section-wise questions
        this.saveSectionQuestion = function(sectionName, answers){
            data[sectionName] = answers;
        }

        this.addQuizData = function(quizid){
            data['quiz'] = quizid;
        }

        // Send the answers to server on normal submission
        this.postTest = function(testUser){
            return $resource(baseURL+"save/test/", { 'test_user': testUser},
                {'save':   
                { method:'POST', 
                } 
                },
                { stripTrailingSlashes: false }
                );
        };  

        this.getAQuestion = function(sectionName, count){
            return allQuestions[sectionName][count-1][count];
        }
        }]);
