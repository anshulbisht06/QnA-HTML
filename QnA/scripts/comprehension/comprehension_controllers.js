/* global $ */

appmodule
    .controller('CreateComprehensionController', ['$scope','$controller', '$state', 'ComprehensionFactory', 'SubCategoryFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $state, ComprehensionFactory, SubCategoryFactory, Upload, ngProgressFactory)  {
        $controller('CookiesController', {$scope : $scope});
        $scope.createComprehensionForm = { content:"",explanation:"", heading:"", sub_category:"", ideal_time:"", level:"easy", que_type:"comprehension" };

        SubCategoryFactory.getAllSubcategories($scope.user, 'all', false).query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });

        function upload(postUrl, data, figure){
            $scope.progressbar.start();
            $scope.progressbar.setHeight('6px');
            $scope.progressbar.setColor('green');
            Upload.upload({
                    url: baseURL+postUrl,
                    data: { figure: figure, data: data },
                    resumeChunkSize: '5MB',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    $state.go('app.add-comprehension-question',{comprehensionId: response.data});
                }, function (response) {
                    $scope.progressbar.complete();
                    alert("Problem in adding questions!");
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }

        $scope.changeImage = function(){
            $scope.isImageChanged = true;
        }

        $scope.removeImage = function(){
            $scope.isImageChanged = false;
            $scope.figure = undefined;
        }
        
        $scope.postComprehension = function() {
            upload("question/comprehension/create/", $scope.createComprehensionForm, $scope.figure);
        }
    }])
    .controller('CreateComprehensionQuestionController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $stateParams, ComprehensionFactory, Upload, ngProgressFactory)  {
        $controller('CookiesController', {$scope : $scope});
        $scope.baseURLImage = baseURLImage;

        function upload(postUrl, data, figure){
            $scope.progressbar.start();
            $scope.progressbar.setHeight('6px');
            $scope.progressbar.setColor('red');
            Upload.upload({
                    url: baseURL+postUrl,
                    data: { figure: figure, data: data },
                    resumeChunkSize: '5MB',
                }).then(function(response) {
                    cleanQuestionForm();
                    $scope.progressbar.complete();
                    alert("Questions added");
                }, function (response) {
                    $scope.progressbar.complete();
                    alert("Problem in adding questions!");
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }

        ComprehensionFactory.getComprehension($stateParams.comprehensionId).get().$promise.then(
            function(response){
                $scope.comprehension = response;
            },
            function(response) {
                $scope.errors = response.data;
            }
        );

        $scope.createComprehensionQuestionForm = { comprehension:$stateParams.comprehensionId, content:"",explanation:"", level:"easy", answer_order:"random", sub_category:"", que_type:"mcq", ideal_time:""};
            $scope.insertBlank = function(){
                $scope.createComprehensionQuestionForm.content += " <<Answer>> ";
            }
            $scope.postComprehensionQuestion = function() {
                upload("question/comprehension/questions/create/", $scope.createComprehensionQuestionForm, $scope.figure);
            }

            $scope.optionss = [
                {
                    optionid : 1,
                    content : '',
                    correct : true
                },
                {
                    optionid : 2,
                    content : '',
                    correct : false
                },
                ];
            $scope.optionCount = 3;
            $scope.addOptions = function(){
                $scope.optionss.push({                 
                                    optionid : $scope.optionCount,
                                    content : '',
                                    correct :  false
                                    });
                $scope.optionCount = $scope.optionCount + 1;
            }
            $scope.removeOption = function(op_id){
                if(op_id > 2){
                    var all = $scope.optionss;
                    $scope.optionss = all.filter(function(el) { return el.optionid != op_id; });
                }
            };

            function cleanQuestionForm(){
                $scope.createComprehensionQuestionForm['explanation'] = '';
                $scope.createComprehensionQuestionForm['ideal_time'] = '';
                $scope.createComprehensionQuestionForm['content'] = '';
                $scope.createComprehensionQuestionForm['optioncontent'] = {};
                $scope.createComprehensionQuestionForm['correctoption'] = '';
            }
    }])
    .controller('ListComprehensionQuestionsController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', function($scope, $controller, $stateParams, ComprehensionFactory)  {
        $controller('CookiesController', {$scope : $scope});
        $scope.curPage = 0;
        $scope.pageSize = 10;
        $scope.baseURLImage = baseURLImage;

        ComprehensionFactory.getComprehension($stateParams.comprehensionId).get().$promise.then(
            function(response){
                $scope.comprehension = response;
            },
            function(response) {
                $scope.errors = response.data;
            }
        );
        
        ComprehensionFactory.getComprehensionQuestions($stateParams.comprehensionId).query(
        function(response){
            $scope.comprehensionQuestions = response.questions;
        },
        function(response){
            $scope.errors = "Unable to get your comprehension questions.";
        });

        $scope.isHoveredOver = {};
        $scope.hoverOnQuestion = function(questionid){
            $scope.isHoveredOver[questionid] = true;
        }
        $scope.hoverOutQuestion = function(questionid){
            $scope.isHoveredOver[questionid] = false;
        }

        $scope.deleteComprehensionQuestion = function(comprehensionQuestionId){
            ComprehensionFactory.deleteComprehensionQuestion(comprehensionQuestionId).delete().$promise.then(
                function(response){
                    var index = findIndexOfObjectInsideList($scope.comprehensionQuestions, response.deletedComprehensionQuestionsId);
                    $scope.comprehensionQuestions.splice(index, 1);
                    alert("Deletion done!");                 
                },
                function(response) {
                    $scope.errors = response.data;
                });
        }
    }])
    .controller('UpdateComprehensionQuestionController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $stateParams, ComprehensionFactory, Upload, ngProgressFactory)  {
        $controller('CookiesController', {$scope : $scope});

        ComprehensionFactory.getComprehensionQuestion($stateParams.comprehensionQuestionId).get()
            .$promise.then(
                function(response){
                    $scope.figure = response.figure;
                    $scope.baseURLImage = baseURLImage;
                    $scope.updateComprehensionQuestionForm = {figure: response.figure, content : response.content, level : response.level, explanation : response.explanation, ideal_time: response.ideal_time };
                },
                function(response) {
                    $scope.unableToGetQuestion = response.data.errors;
                }
            );

         $scope.changeImage = function(){
            $scope.isImageChanged = true;
        }
        $scope.removeImage = function(){
            $scope.isImageChanged = false;
            $scope.updateComprehensionQuestionForm.figure = undefined;
        }

        function upload(postUrl, data){
            $scope.progressbar.start();
            $scope.progressbar.setHeight('6px');
            $scope.progressbar.setColor('orange');
            Upload.upload({
                    url: baseURL+postUrl,
                    data: { data: data },
                    resumeChunkSize: '5MB',
                    method: 'PUT',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    $scope.isImageChanged = false;
                    $scope.figure = response.data.figure;
                    $scope.updateComprehensionQuestionForm = {figure: undefined, content : response.data.content, level : response.data.level, explanation : response.data.explanation, ideal_time: response.data.ideal_time };
                    alert("Questions updated");
                }, function (response) {
                    $scope.progressbar.complete();
                    alert("Problem in updating question!");
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }

        $scope.putComprehensionQuestion = function() {
            upload("question/comprehension/operations/"+$stateParams.comprehensionQuestionId+"/", $scope.updateComprehensionQuestionForm);
        }
    }])
    .controller('UpdateComprehensionAnswersController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', function($scope, $controller, $stateParams, ComprehensionFactory)  {
        $controller('CookiesController', {$scope : $scope});

        function modifyTheResult(){
            actualAnswerID = "";
            optionsContent = {};
            for(var i=0;i<$scope.answers.options.length;i++){
                if($scope.answers.options[i].correct){
                    actualAnswerID = $scope.answers.options[i].id;
                }
                optionsContent[$scope.answers.options[i].id] = $scope.answers.options[i].content;
            }
            $scope.updateComprehensionAnswersForm = {correctOption : actualAnswerID.toString(), optionsContent : optionsContent};
        }

        ComprehensionFactory.getComprehensionAnswers($stateParams.comprehensionQuestionId).get()
            .$promise.then(
                function(response){
                    $scope.answers = response;
                    modifyTheResult();                    
                },
                function(response) {
                    $scope.unableToGetAnswers = response.data.errors;
                }
            );

        $scope.putComprehensionAnswers = function() {
            ComprehensionFactory.updateComprehensionAnswers($stateParams.comprehensionQuestionId).update($scope.updateComprehensionAnswersForm).$promise.then(
                function(response){
                    $scope.answers = response;
                    modifyTheResult();
                    alert('Answer updated succesfully!');
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the answers. See below errors.";
                    $scope.errors = response.data.errors;
                });
            setTimeout(closeAlert, 5000);
        }
    }]);