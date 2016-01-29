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
                return $resource(baseURL+"quiz/category/create/", null,
                    {'save':   {method:'POST'} },
                    { stripTrailingSlashes: false }
                    );
        };
        this.createSubCategory = function(){
                return $resource(baseURL+"quiz/subcategory/create/", null,
                    {'save':   {method:'POST'} },
                    { stripTrailingSlashes: false }
                    );
        };

    }])
    .service('allQuestionsFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        questions = {'Clinical Audit - 1' : [], 'Clinical Audit - 2' : []};
        levels = ['E','H','M'];
        totalEasyQuestions = 0;
        totalMediumQuestions = 0;
        totalHardQuestions = 0;
        for(var i=0;i<30;i++){
            l = levels[Math.floor(Math.random() * levels.length)];
            if(l==='E')
                totalEasyQuestions+=1;
            if(l==='M')
                totalMediumQuestions+=1;
            if(l==='H')
                totalHardQuestions+=1;
            q = {
                    id : i,
                    level : l,
                    type : 'mcq',
                    question : 'If during a clinical audit "all/most standards were not met", the next course of action must be _____.',
                    options : [
                        { id : 0, content : 'After action has been implemented, repeat data collection only for those standards not met', correct : false}, 
                        { id : 1, content : 'After action has been implemented, repeat entire clinical audit process', correct : true},
                        { id : 2, content : 'Repeat clinical audit process at a later date to ensure that this is maintained', correct : false},
                        { id : 3, content : 'Review and modify standards – repeat entire clinical audit', correct : false},
                        ]            
                }
            questions['Clinical Audit - 1'].push(q);
            questions['Clinical Audit - 2'].push(q);
        }
        this.selectedd = "true";
        this.questions = questions;
        this.totalQuestions = totalHardQuestions+totalEasyQuestions+totalMediumQuestions;
        this.totalHardQuestions = totalHardQuestions;
        this.totalEasyQuestions = totalEasyQuestions;
        this.totalMediumQuestions = totalMediumQuestions;
    }]);