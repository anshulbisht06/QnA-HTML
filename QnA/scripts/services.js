/* global $ */

angular.module('QnA')
    .constant("baseURL","http://localhost:8000/")
    .service('indexFactory', function() { 
        // this.introductionCarousel = ['images/bg.png', 'images/wedding.png', 'images/corporate-party.png'];
    })


    .service('UserRegisterFactory',['$resource', 'baseURL', function($resource, baseURL) { 
        this.createUser = function(token){
            return $resource(baseURL+"register/", null,
                    {'save':   
                    { method:'POST', headers: {'Authorization': 'JWT ' + token} } 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    .service('QuizFactory', ['$resource', 'baseURL', function($resource, baseURL) { 
        this.createQuiz = function(token){
                return $resource(baseURL+"quiz/create/", null,
                    {'save':   {method:'POST', headers: {'Authorization': 'JWT ' + token} }
                    },
                    { stripTrailingSlashes: false }
                    );
        };
        this.getAllQuiz = function(token, userid){
            return $resource(baseURL+"quiz/get/"+userid+"/quiz/", null,
                    {
                        query: {
                        headers: {'Authorization': 'JWT ' + token},
                        method : 'GET',
                        isArray : true,
                        }
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])


    .service('CategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        this.createCategory = function(token){
                return $resource(baseURL+"quiz/category/create/", null,
                    {'save':   {
                        method:'POST',
                        headers: {'Authorization': 'JWT ' + token}
                    }
                },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllCategories = function(token, userid, quizid){
        return $resource(baseURL+"quiz/category/get/"+userid+"/"+quizid+"/", null,
        {
            query: {
            headers: {'Authorization': 'JWT ' + token},
            method : 'GET',
            isArray : true,
            }
        },
        { stripTrailingSlashes: false }
        )};
    }])


    .service('SubCategoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        this.createSubCategory = function(token){
                return $resource(baseURL+"quiz/subcategory/create/", null,
                    {'save':   {method:'POST', headers: {'Authorization': 'JWT ' + token} }
                    },
                    { stripTrailingSlashes: false }
                    );
        };

        this.getAllSubcategories = function(token, userid, quizid, categoryid){
        return $resource(baseURL+"quiz/subcategory/get/"+userid+"/"+quizid+"/"+categoryid+"/", null,
            {
                query: {
                headers: {'Authorization': 'JWT ' + token},
                method : 'GET',
                isArray : true,
                }
            },
            { stripTrailingSlashes: false }
            )
        };
    }])


    .service('QuestionsFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        questions = {'Clinical Audit - 1' : [], 'Clinical Audit - 2' : []};
        levels = ['E','H','M'];
        totalEasyQuestions = 0;
        totalMediumQuestions = 0;
        totalHardQuestions = 0;
        this.getAllQuestions = function(token, userid, quizid, categoryid, subcategoryid){
                return $resource(baseURL+"quiz/questions/get/"+userid+"/"+quizid+"/"+categoryid+"/"+subcategoryid+"/", null,
                {
                    query: {
                    headers: {'Authorization': 'JWT ' + token},
                    method : 'GET',
                    isArray : false,
                    }
                },
                { stripTrailingSlashes: false }
                );
        };
        // for(var i=0;i<30;i++){
        //     l = levels[Math.floor(Math.random() * levels.length)];
        //     if(l==='E')
        //         totalEasyQuestions+=1;
        //     if(l==='M')
        //         totalMediumQuestions+=1;
        //     if(l==='H')
        //         totalHardQuestions+=1;
        //     q = {
                    // id : i,
                    // level : l,
                    // question : 'If during a clinical audit "all/most standards were not met", the next course of action must be _____.',
                    // options : [
                    //     { id : 0, content : 'After action has been implemented, repeat data collection only for those standards not met', correct : false}, 
                    //     { id : 1, content : 'After action has been implemented, repeat entire clinical audit process', correct : true},
                    //     { id : 2, content : 'Repeat clinical audit process at a later date to ensure that this is maintained', correct : false},
                    //     { id : 3, content : 'Review and modify standards – repeat entire clinical audit', correct : false},
                    //     ]            
        //         }
        //     questions['Clinical Audit - 1'].push(q);
        //     questions['Clinical Audit - 2'].push(q);
        // }
        this.questions = questions;
        this.totalQuestions = totalHardQuestions+totalEasyQuestions+totalMediumQuestions;
        this.totalHardQuestions = totalHardQuestions;
        this.totalEasyQuestions = totalEasyQuestions;
        this.totalMediumQuestions = totalMediumQuestions;




        this.createQuestion = function(token){
            return $resource(baseURL+"question/mcq/create/", null,
                    {'save':   
                    { method:'POST', headers: {'Authorization': 'JWT ' + token}} 
                    },
                    { stripTrailingSlashes: false }
                    );
        }
    }])

