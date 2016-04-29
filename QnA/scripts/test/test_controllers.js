/* global $ */

appmodule
    .controller('TestPreviewController', ['$scope', '$controller', '$window', '$interval', '$stateParams', 'TestPreviewFactory', function($scope, $controller, $window, $interval, $stateParams, TestPreviewFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.allQuestions = {};
        var firstQuestionVisited = false;
        $scope.baseURL = baseURLImage;
        $scope.progressValuesModel = {};
        $scope.answersModel = {};

        function returnQuestions(sectionName, response, existingQuestions){
            if(existingQuestions){
                $scope.total_questions = makeArray(existingQuestions.length);
            }else if(response){
                $scope.total_questions = makeArray(response.total_questions);
                if(response.question_order==="random"){
                    var questions = response.questions;
                }else{
                    var questions = response.questions;
                }
                for(var i=0;i<questions.length;i++){
                    $scope.answersModel[questions[i][i+1].id] = { value:null };
                    $scope.progressValuesModel[questions[i][i+1].id] = { status:'NV' };
                }
                TestPreviewFactory.addQuestionsForSection(sectionName, questions);
                TestPreviewFactory.saveSectionQuestionAnswers(sectionName, $scope.answersModel);
                TestPreviewFactory.saveProgressValues(sectionName, $scope.progressValuesModel);
            }
            $scope.sliced_questions = $scope.total_questions.slice(0,15);
            $scope.sliceFactor = 0;
            $scope.slicingLimit = Math.floor($scope.total_questions.length/15);
            firstQuestionVisited = false;
            $scope.changeQuestion(1);
        }

        $scope.getQuestionsBasedOnSection = function(sectionName, quizid){
            var existingQuestions = TestPreviewFactory.getQuestionsForASection(sectionName);
            if(existingQuestions!=undefined){
                returnQuestions(sectionName, false, existingQuestions);
            }else{
                TestPreviewFactory.getQuestionsBasedOnSection(quizid, sectionName).query(
                    function(response){
                        returnQuestions(sectionName, response, false);
                    },
                    function(response){
                        alert('Problem in getting questions from server-side.');
                });
            }
        }
        $scope.openWarningModal = function(action){
            $scope.action = action;
            switch(action){
                case "sectionChangeRequestInitiated":
                    toggleWarningModal('show', '<b>Do you really want to change the section?</b>', 'Yes I am sure.');
                    break;
                case "sectionChangeRequestCancelled":
                    toggleWarningModal('hide', '', '');
                    $scope.selectedSection = $scope.currentSection;
                    break;
                case "submitTestRequestInitiated":
                    toggleWarningModal('show', '<b>Are you sure you want to submit the test?</b>', 'Yes I am sure.');
                    break;
                case "submitTestRequestCancelled":
                    toggleWarningModal('hide', '', '');
                    break;
            }
        }
        $scope.changeSection = function(currentSection){
            $scope.nextSection = $scope.selectedSection;
            if($scope.sectionNames.indexOf($scope.selectedSection)<$scope.sectionNames.length){
                if($scope.currentSection === $scope.nextSection){
                    $scope.selectedSection = $scope.sectionNames[$scope.sectionNames.indexOf($scope.selectedSection)+1];
                }else{
                    $scope.selectedSection = $scope.sectionNames[$scope.sectionNames.indexOf($scope.nextSection)];
                }
                // $scope.sectionNames.splice($scope.sectionNames.indexOf($scope.currentSection), 1);
                $scope.addQuestions($scope.selectedSection);
                if($scope.sectionNames.indexOf($scope.selectedSection)===$scope.sectionNames.length-1){
                    $scope.hideNextSectionButton = true;
                }
                $scope.currentSection = $scope.selectedSection;                
            }
            else{
                $scope.hideNextSectionButton = true;
            }
        }

        $scope.addQuestions = function(sectionName){
            $scope.sliceFactor = 0;
            $scope.getQuestionsBasedOnSection(sectionName, $scope.quiz);
        }

        $scope.changeQuestion = function(count){
            if(count>=1 && count<=$scope.total_questions.length)
            {
                // var question = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                $scope.currentCount = count;
                $scope.currentQuestion = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                if(isMCQ($scope.currentQuestion.que_type)){
                    $scope.currentOptions = $scope.currentQuestion.options;
                }else{
                    $scope.currentOptions = [];
                }
                if($scope.progressValuesModel[$scope.currentQuestion.id].status==='NV'){
                    $scope.progressValuesModel[$scope.currentQuestion.id].status = 'NA';
                    $scope.progressValues = changeProgressValues($scope.progressValuesModel);
                    TestPreviewFactory.saveProgressValues($scope.selectedSection, $scope.progressValuesModel);
                }
            }
        }
        $scope.saveAnswer = function(count, answerId){
            if(isMCQ($scope.currentQuestion.que_type))
            {
                if($scope.answersModel[$scope.currentQuestion.id].value===answerId){
                }else{
                    $scope.answersModel[$scope.currentQuestion.id].value = answerId;
                    TestPreviewFactory.saveOrChangeAnswer($scope.selectedSection, count, answerId, true);
                }
            }
            else{
            }
        }
        // Watch for a change in answersModel
        $scope.$watch(function() {
           return $scope.answersModel;
         },                       
          function(newVal, oldVal) {
            try{ 
                if($scope.currentCount > 1 || ($scope.currentCount > 1 && $scope.currentQuestion.que_type === 'mcq')){
                    if($scope.progressValuesModel[$scope.currentQuestion.id].status === 'NV'){
                        $scope.progressValuesModel[$scope.currentQuestion.id].status = 'NA';
                    }
                    else if($scope.progressValuesModel[$scope.currentQuestion.id].status === 'NA'){
                        $scope.progressValuesModel[$scope.currentQuestion.id].status = 'A';
                    }
                }else if($scope.currentCount === 1){
                    if($scope.currentQuestion.que_type === 'objective'){
                        if(!firstQuestionVisited){
                            firstQuestionVisited = true;
                        }else{
                            if($scope.progressValuesModel[$scope.currentQuestion.id].status === 'NA'){
                            $scope.progressValuesModel[$scope.currentQuestion.id].status = 'A';
                            }
                        }
                    }
                    if($scope.currentQuestion.que_type === 'mcq'){
                        if(!firstQuestionVisited){
                            firstQuestionVisited = true;
                        }else{
                            if($scope.progressValuesModel[$scope.currentQuestion.id].status === 'NA'){
                            $scope.progressValuesModel[$scope.currentQuestion.id].status = 'A';
                            }
                        }
                    }   
                }
                $scope.progressValues = changeProgressValues($scope.progressValuesModel);
                TestPreviewFactory.saveProgressValues($scope.selectedSection, $scope.progressValuesModel);
            }catch(err){}
        }, true);
        function sliceOutQuestions(){
            $scope.sliced_questions = $scope.total_questions.slice($scope.sliceFactor*15, ($scope.sliceFactor+1)*15);
        }
        $scope.decreaseSlicing = function(){
            $scope.sliceFactor -= 1;
            sliceOutQuestions();
        }
        $scope.increaseSlicing = function(){
            $scope.sliceFactor += 1;
            sliceOutQuestions();
        }

        try{
            if(isNotEmpty($window.opener.data)){
                $scope.quiz = $window.opener.data['quiz'];
                TestPreviewFactory.addQuizData($scope.quiz);
                $scope.sectionNames = Object.keys($window.opener.data['details']).sort();
                if($scope.sectionNames.length<=1){
                    $scope.hideNextSectionButton = true;
                }
                $scope.selectedSection = $scope.sectionNames[0];
                $scope.currentSection = $scope.selectedSection;
                $scope.addQuestions($scope.selectedSection);
                // for(var i=0;i<sectionNames.length;i++){
                //     angular.element(document.querySelector('#sectionnames')).append('<option value='+sectionNames[i]+'>'+sectionNames[i]+'</option>');
                // }
                $scope.totalDuration = findTotalDuration($window.opener.data['quizStacks']);
                $interval(function(){
                    $scope.totalDuration -= 1;
                    if($scope.totalDuration===0){
                        alert('Time Over');
                    }
                },1000, $scope.totalDuration);
                $scope.dataPresent = true;
            }else{
                $scope.dataPresent = false;
            }
        }catch(e){
            $scope.dataPresent = false;
        }
    }])

.controller('TestPreviewHeaderController', ['$scope', '$controller', '$window', function($scope, $controller, $window) {
            $controller('CookiesController', {$scope : $scope});
            // console.log($window.opener.data.quiz)
            if(isNotEmpty($window.opener.data)){
            	$scope.quizName = $window.opener.data['quizName'];
            	$scope.closePreviewWindow = function(){
                	$window.close();
            	}
            	$scope.dataPresent = true;      
            }
            else{
                $scope.dataPresent = false;
            }   
        }]);
