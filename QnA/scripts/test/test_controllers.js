/* global $ */

appmodule
    .controller('TestPreviewController', ['$scope', '$controller', '$window', '$interval', '$stateParams', 'TestPreviewFactory', function($scope, $controller, $window, $interval, $stateParams, TestPreviewFactory) {
        $controller('CookiesController', {$scope : $scope});
        var firstQuestionVisited = false;
        $scope.baseURL = baseURLImage;
        $scope.progressValuesModel = {};
        $scope.answersModel = {};
        $scope.comprehensionAnswersModel = {};
        var comprehensionQuestions = 0;

        function returnQuestions(sectionName, response, existingQuestions){
            if(existingQuestions){
                $scope.total_questions = makeArray(existingQuestions.length);
            }else if(response){
                $scope.total_questions = makeArray(response.questions.length);
                var questions = response.questions;
                console.log(questions);
                for(var i=0;i<questions.length;i++){
                    var q = questions[i][i+1];
                    $scope.answersModel[q.id] = { value:null };
                    $scope.progressValuesModel[q.id] = { status: progressTypes[1] };
                    if(q.que_type === qTypes[2]){
                        $scope.answersModel[q.id]['comprehension_questions'] = [];
                        $scope.answersModel[q.id]['heading'] = q.heading;
                        for(var j=0;j<q.comprehension_questions.length;j++){
                            $scope.comprehensionAnswersModel[q.comprehension_questions[j][j+1].id] = { value:null };
                        }                        
                    }
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
                $scope.currentComprehensionQuestion = [];
                $scope.currentCount = count;
                if($scope.currentComprehensionQuestionCount!=undefined){
                    $scope.isComprehension = false;
                    delete $scope.currentComprehensionQuestion;
                    delete $scope.currentComprehensionQuestionCount;
                    delete $scope.comprehensionQuestionsLimit;
                    comprehensionQuestions = null;
                }
                $scope.currentQuestion = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                if($scope.currentQuestion.que_type === qTypes[0]){
                    $scope.currentOptions = $scope.currentQuestion.options;
                    $scope.instruction = setInstruction($scope.currentQuestion.problem_type);
                }else if(($scope.currentQuestion.que_type === qTypes[1])){
                    $scope.currentOptions = [];
                }else{
                    $scope.isComprehension = true;
                    comprehensionQuestions = $scope.currentQuestion.comprehension_questions;
                    $scope.instruction = 'Read the given passage and answer the questions that follow:';
                    $scope.comprehensionQuestionsLimit = comprehensionQuestions.length - 1;
                    $scope.changeComprehensionQuestion(0);
                }
                if($scope.progressValuesModel[$scope.currentQuestion.id].status === progressTypes[1]){
                    $scope.progressValuesModel[$scope.currentQuestion.id].status = progressTypes[0];
                    $scope.progressValues = changeProgressValues($scope.progressValuesModel);
                    TestPreviewFactory.saveProgressValues($scope.selectedSection, $scope.progressValuesModel);
                }
            }
        }

        $scope.changeComprehensionQuestion = function(comprehensionCount){
            if(comprehensionCount>=0 && comprehensionCount<=$scope.comprehensionQuestionsLimit)
            {
                $scope.currentComprehensionQuestionCount = comprehensionCount;
                $scope.currentComprehensionQuestion = comprehensionQuestions[comprehensionCount][comprehensionCount+1];
            }
        }

        function markFirstQuestionVisited(){
            if(!firstQuestionVisited){
                firstQuestionVisited = true;
            }else{
                if($scope.progressValuesModel[$scope.currentQuestion.id].status === progressTypes[0]){
                $scope.progressValuesModel[$scope.currentQuestion.id].status = progressTypes[2];
                console.log('ffff');
                }
            }
        }
        // Watch for a change in answersModel
        $scope.$watch(function() {
           return $scope.answersModel;
         },                       
          function(newVal, oldVal) {
            if(newVal!=oldVal && $scope.currentQuestion.que_type === qTypes[0]){
                try{ 
                    if($scope.currentCount > 1 || ($scope.currentCount > 1)){
                        if($scope.progressValuesModel[$scope.currentQuestion.id].status === progressTypes[1]){
                            $scope.progressValuesModel[$scope.currentQuestion.id].status = progressTypes[0];
                        }
                        else if($scope.progressValuesModel[$scope.currentQuestion.id].status === progressTypes[0]){
                            $scope.progressValuesModel[$scope.currentQuestion.id].status = progressTypes[2];
                        }
                    }else if($scope.currentCount === 1){
                        markFirstQuestionVisited();
                    }
                    $scope.progressValues = changeProgressValues($scope.progressValuesModel);
                    // TestPreviewFactory.saveProgressValues($scope.selectedSection, $scope.progressValuesModel);
                }catch(err){}
            }
        }, true);

        // Watch for a change in comprehensionAnswersModel
        $scope.$watch(function() {
           return $scope.comprehensionAnswersModel;
         },                       
          function(newVal, oldVal) {
            try{ 
                if(newVal!=oldVal && $scope.currentQuestion.que_type === qTypes[2]){
                    markFirstQuestionVisited();
                    $scope.progressValues = changeProgressValues($scope.progressValuesModel);
                }
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
