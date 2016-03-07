/* global $ */

appmodule
    .controller('TestPreviewController', ['$scope', '$controller', '$window', '$interval', '$stateParams', 'TestPreviewFactory', function($scope, $controller, $window, $interval, $stateParams, TestPreviewFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.allQuestions = {};
        $scope.getQuestionsBasedOnSection = function(sectionName, quizid){
            TestPreviewFactory.getQuestionsBasedOnSection(quizid, sectionName).query(
                function(response){
                    $scope.total_questions = response.total_questions;
                    $scope.sliced_questions = $scope.total_questions.slice(0,15);
                    $scope.sliceFactor = 0;
                    $scope.slicingLimit=Math.floor($scope.total_questions.length/15);
                    $scope.answersModel = {};
                    var questionsAdded = TestPreviewFactory.addQuestionsForSection(sectionName, response.questions);
                    for(var i=0;i<questionsAdded.length;i++){
                        $scope.answersModel[questionsAdded[i][i+1].id] = { value:null, status:'NV'};
                    }
                    TestPreviewFactory.saveSectionQuestion(sectionName, $scope.answersModel);
                    $scope.changeQuestion(1);
                },
                function(response){
                    alert('Problem in getting questions from server-side.');
            });
        }
        $scope.openWarningModal = function(action){
            $scope.action = action;
            switch(action){
                case "sectionRequestInitiated":
                    toggleWarningModal('show', 'Do you really want to move to next section.<br><br><b>You cannot revisit this section again.</b>', 'Yes I am sure.');
                    break;
                case "sectionRequestCancelled":
                    toggleWarningModal('hide', '', '');
                    $scope.selectedSection = $scope.currentSection;
                    break;
                case "submitRequestInitiated":
                    toggleWarningModal('show', '<b>Are you sure you want to submit the answers?</b>', 'Yes I am sure.');
                    break;
                case "submitRequestCancelled":
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
                $scope.sectionNames.splice($scope.sectionNames.indexOf($scope.currentSection), 1);
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
        $scope.getQuestionsForThisSection = function(sectionName){
            console.log(TestPreviewFactory.getQuestionsForASection(sectionName));
        }
        $scope.show = function(){
            console.log(TestPreviewFactory.showAllQuestionsAnswered());
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
            }
            $scope.progressValues = changeProgressValues($scope.answersModel);
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
            $scope.progressValues = changeProgressValues($scope.answersModel);
        }
        $scope.$watch(function () {
           return $scope.answersModel;
         },                       
          function(newVal, oldVal) {
            try{
                $scope.answersModel[$scope.currentQuestion.id].status = 'A';
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
        $scope.submitTest = function(){
            TestPreviewFactory.postTest($stateParams.obj.test_user).save(TestPreviewFactory.showAllQuestionsAnswered()).$promise.then(
                function(response){
                    console.log('success');                    
                },
                function(response) {
                    console.log('failed');
                });
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
            console.log(e);
            $scope.dataPresent = false;
        }
    }])


.controller('UserDataController',['$scope','$state', 'testUserDataFactory','$controller', '$window', function($scope, $state, testUserDataFactory, $controller, $window) {
        	$scope.data = {name: '', email: '', quiz: $window.opener.data.quiz, quiz_name: $window.opener.data.quizName, 'test_key': 'f86d61d474de2b13499c' };
            $scope.postUserDetails = function(){testUserDataFactory.saveTestUser().save($scope.data).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $state.go('app.test-preview', {obj:{'name':response.user_name , 'email':response.email, 'test_key': response.test_key, 'test_user': response.test_user}});                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to find the user - please try again.";
                    $scope.errors = response.data;
                });}
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
