/* global $ */

appmodule
    .controller('TestPreviewController', ['$scope', '$controller', '$window', '$state', '$cookies', '$interval', 'TestPreviewFactory', function($scope, $controller, $window, $state, $cookies, $interval, TestPreviewFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.allQuestions = {};
        $scope.getQuestionsBasedOnSection = function(sectionName, quizid){
            TestPreviewFactory.getQuestionsBasedOnSection($cookies.get('token'), quizid, sectionName).query(
                function(response){
                    $scope.total_questions = response.total_questions;
                    $scope.answersModel = {};
                    var questionsAdded = TestPreviewFactory.addQuestionsForSection(sectionName, response.questions);
                    console.log(questionsAdded);
                    for(var i=0;i<questionsAdded.length;i++){
                        $scope.answersModel[questionsAdded[i][i+1].id] = null;
                    }
                    $scope.changeQuestion(1);
                },
                function(response){
                    alert('Problem in getting questions from server-side.');
            });
        }
        $scope.changeSection = function(){
            if($scope.sectionNames.indexOf($scope.selectedSection)<$scope.sectionNames.length-1){
                $scope.selectedSection = $scope.sectionNames[$scope.sectionNames.indexOf($scope.selectedSection)+1];
                $scope.addQuestions($scope.selectedSection);
                if($scope.sectionNames.indexOf($scope.selectedSection)===$scope.sectionNames.length-1){
                    $scope.hideNextSection = true;
                }
            }
            else{
                $scope.hideNextSection = true;
            }
        }
        $scope.addQuestions = function(sectionName){
            $scope.getQuestionsBasedOnSection(sectionName, $scope.quiz);
        }
        $scope.getQuestionsForThisSection = function(sectionName){
            console.log(TestPreviewFactory.getQuestionsForASection(sectionName));
        }
        $scope.show = function(){
            console.log($scope.answersModel);
        }
        $scope.changeQuestion = function(count){
            if(count>=1 && count<=$scope.total_questions.length)
            {
                // var question = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                $scope.currentCount = count;
                $scope.currentQuestion = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                if($scope.answersModel[$scope.currentQuestion.id]!=undefined)
                {
                }
                else{
                    $scope.answersModel[$scope.currentQuestion.id] = undefined;
                }
                if(isMCQ($scope.currentQuestion.que_type)){
                    $scope.currentOptions = $scope.currentQuestion.options;
                }else{
                    $scope.currentOptions = [];
                }
            }
        }
        $scope.saveAnswer = function(count, answerId){
            if(isMCQ($scope.currentQuestion.que_type))
            {
                if($scope.answersModel[$scope.currentQuestion.id]===answerId){
                }else{
                    $scope.answersModel[$scope.currentQuestion.id] = answerId;
                    TestPreviewFactory.saveOrChangeAnswer($scope.selectedSection, count, answerId, true);
                }
            }
            else{
            }
        }
        try{
            if(isNotEmpty($window.opener.data)){
                $scope.quiz = $window.opener.data['quiz'];
                $scope.sectionNames = Object.keys($window.opener.data['details']).sort();
                $scope.selectedSection = $scope.sectionNames[0];
                $scope.addQuestions($scope.sectionNames[0]);
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
        	$scope.data = {name: '', email: '', quiz: $window.opener.data.quiz, quiz_name: $window.opener.data.quizName};
            $scope.postUserDetails = function(){testUserDataFactory.saveTestUser().save($scope.data).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $state.go('app.test-preview', {obj:{'user_name':response.user_name}});                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the user - please try again.";
                    $scope.errors = response.data;
                });}
		}])


.controller('TestPreviewHeaderController', ['$scope', '$controller', '$window', '$state', '$cookies', function($scope, $controller, $window, $state, $cookies) {
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
