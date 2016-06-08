/* global $ */

appmodule
    .controller('CreateComprehensionController', ['$scope','$controller', '$state', 'ComprehensionFactory', 'SubCategoryFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $state, ComprehensionFactory, SubCategoryFactory, Upload, ngProgressFactory)  {
        $controller('CookiesController', {$scope : $scope});
        try{
        var temp = $scope._rest.split(',');
        $scope.createComprehensionForm = { content:"",explanation:"", heading:"", sub_category:"", ideal_time:"", level:"easy", que_type:"comprehension", user:temp[0], hash:temp[1] };

        SubCategoryFactory.getAllSubcategories(temp, 'all', true).query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });

        function upload(postUrl, data, figure){
            $scope.changeProgressBar('6px', 'green');
            var settings = $.extend({}, data, {figure: figure});
            
            Upload.upload({
                    url: baseURL+postUrl,
                    data: settings,
                    resumeChunkSize: '5MB',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    $state.go('app.add-comprehension-question',{comprehensionId: response.data});
                }, function (response) {
                    $scope.progressbar.complete();
                    showAlert('alert-danger', "Unable to create the question. See below error.");
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
        }catch(err){}
    }])
    .controller('CreateComprehensionQuestionController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $stateParams, ComprehensionFactory, Upload, ngProgressFactory)  {
        $controller('CookiesController', {$scope : $scope});
        $scope.baseURLImage = baseURLImage;
        try{
        var temp = $scope._rest.split(',');
        
        function upload(postUrl, data, figure){
            $scope.changeProgressBar('6px', 'red');
            data['optioncontent'] = JSON.stringify(data['optioncontent']);    
            var finalData = $.extend({}, data, {figure: figure});
            Upload.upload({
                    url: baseURL+postUrl,
                    data: finalData,
                    resumeChunkSize: '5MB',
                }).then(function(response) {
                    cleanQuestionForm();
                    $scope.progressbar.complete();
                    showAlert('alert-success', 'Your question has been created.');
                }, function (response) {
                    $scope.progressbar.complete();
                    if($scope.createComprehensionQuestionForm!=undefined){
                        $scope.createComprehensionQuestionForm = { user:$scope.createComprehensionQuestionForm.user, hash:$scope.createComprehensionQuestionForm.hash, comprehension:$scope.createComprehensionQuestionForm.comprehension, content:$scope.createComprehensionQuestionForm.content, explanation: $scope.createComprehensionQuestionForm.explanation, level: $scope.createComprehensionQuestionForm.level, answer_order:$scope.createComprehensionQuestionForm.answer_order, ideal_time: $scope.createComprehensionQuestionForm.ideal_time };
                    }
                    showAlert('alert-danger', "Unable to create the question. See below error.");
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }
        ComprehensionFactory.getComprehension(temp, $stateParams.comprehensionId).get().$promise.then(
            function(response){
                $scope.comprehension = response;
            },
            function(response) {
                $scope.errors = response.data;
            }
        );

        $scope.createComprehensionQuestionForm = { user:temp[0], hash:temp[1], comprehension:$stateParams.comprehensionId, content:"",explanation:"", level:"easy", answer_order:"random", ideal_time:7};
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
                                    });
                $scope.optionCount = $scope.optionCount + 1;
            }
            $scope.removeOption = function(op_id){
                if(op_id > 2){
                    var all = $scope.optionss;
                    $scope.optionss = all.filter(function(el) { return el.optionid != op_id; });
                }
            }

            $scope.changeImage = function(){
                $scope.isImageChanged = true;
            }
            $scope.removeImage = function(){
                $scope.isImageChanged = false;
                $scope.figure = undefined;
            }

            function cleanQuestionForm(){
                $scope.createComprehensionQuestionForm['explanation'] = '';
                $scope.createComprehensionQuestionForm['ideal_time'] = 7;
                $scope.createComprehensionQuestionForm['content'] = '';
                $scope.createComprehensionQuestionForm['optioncontent'] = {};
                $scope.createComprehensionQuestionForm['correctoption'] = '';
                $scope.figure = undefined;
                $scope.isImageChanged = false;
            }
            }catch(err){}
    }])
    .controller('ListComprehensionQuestionsController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', function($scope, $controller, $stateParams, ComprehensionFactory)  {
        $controller('CookiesController', {$scope : $scope});
        try{
        var temp = $scope._rest.split(',');
        $scope.curPage = 0;
        $scope.pageSize = 10;
        $scope.baseURLImage = baseURLImage;
        ComprehensionFactory.getComprehension(temp, $stateParams.comprehensionId).get().$promise.then(
            function(response){
                $scope.comprehension = response;
            },
            function(response) {
                $scope.errors = response.data;
            }
        );
        
        ComprehensionFactory.getComprehensionQuestions(temp, $stateParams.comprehensionId).query(
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
            ComprehensionFactory.deleteComprehensionQuestion(temp, comprehensionQuestionId).delete().$promise.then(
                function(response){
                    var index = findIndexOfObjectInsideList($scope.comprehensionQuestions, response.deletedComprehensionQuestionsId);
                    $scope.comprehensionQuestions.splice(index, 1);
                    showAlert('alert-info', 'Deletion done.');
                },
                function(response) {
                    showAlert('alert-danger', "Unable to delete the question. See below error.");
                    $scope.errors = response.data.errors;
                });
        }
        }catch(err){}
    }])
    .controller('UpdateComprehensionQuestionController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $stateParams, ComprehensionFactory, Upload, ngProgressFactory)  {
        $controller('CookiesController', {$scope : $scope});
        try{
        var temp = $scope._rest.split(',');

        ComprehensionFactory.getComprehensionQuestion(temp, $stateParams.comprehensionQuestionId).get()
            .$promise.then(
                function(response){
                    $scope.figure = response.figure;
                    $scope.baseURLImage = baseURLImage;
                    $scope.updateComprehensionQuestionForm = { user:temp[0], hash:temp[1], comprehension: $stateParams.comprehensionId, content : response.content, level : response.level, explanation : response.explanation, ideal_time: response.ideal_time };
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
            $scope.changeProgressBar('6px', 'orange');
            Upload.upload({
                    url: baseURL+postUrl,
                    data: data,
                    resumeChunkSize: '5MB',
                    method: 'PUT',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    $scope.isImageChanged = false;
                    $scope.figure = response.data.figure;
                    $scope.updateComprehensionQuestionForm = { user:temp[0], hash:temp[1], comprehension: $stateParams.comprehensionId, figure: undefined, content : response.data.content, level : response.data.level, explanation : response.data.explanation, ideal_time: response.data.ideal_time };
                    showAlert('alert-success', 'Your question has been updated.');
                }, function (response) {
                    $scope.progressbar.complete();
                    showAlert('alert-danger', "Unable to update the question. See below error.");
                    $scope.updateComprehensionQuestionForm = { comprehension: $stateParams.comprehensionId, figure: $scope.updateComprehensionQuestionForm.figure, content : $scope.updateComprehensionQuestionForm.content, level : $scope.updateComprehensionQuestionForm.level, explanation : $scope.updateComprehensionQuestionForm.explanation, ideal_time: $scope.updateComprehensionQuestionForm.ideal_time };
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }

        $scope.putComprehensionQuestion = function() {
            upload("question/comprehension/operations/"+$stateParams.comprehensionQuestionId+"/", $scope.updateComprehensionQuestionForm);
        }
        }catch(err){}
    }])
    .controller('UpdateComprehensionAnswersController', ['$scope','$controller', '$stateParams', 'ComprehensionFactory', function($scope, $controller, $stateParams, ComprehensionFactory)  {
        $controller('CookiesController', {$scope : $scope});
        try{
        var temp = $scope._rest.split(',');

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

        ComprehensionFactory.getComprehensionAnswers(temp, $stateParams.comprehensionQuestionId).get()
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
            ComprehensionFactory.updateComprehensionAnswers(temp, $stateParams.comprehensionQuestionId).update($scope.updateComprehensionAnswersForm).$promise.then(
                function(response){
                    $scope.answers = response;
                    modifyTheResult();
                    showAlert('alert-success', 'Your answers have been updated.');
                },
                function(response) {
                    showAlert('alert-danger', "Unable to update the answers. See below error."); 
                    $scope.errors = response.data.errors;
                });
        }
        }catch(err){}
    }]);