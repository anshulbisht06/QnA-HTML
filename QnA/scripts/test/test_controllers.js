angular.module('QnA')

.controller('TestPreviewController', ['$scope', '$controller', '$window', '$state', '$cookies', 'TestPreviewFactory', function($scope, $controller, $window, $state, $cookies, TestPreviewFactory) {
            $controller('CookiesController', {$scope : $scope});
            $scope.allQuestions = {};
            $scope.getQuestionsBasedOnSection = function(sectionName, quizid){
                TestPreviewFactory.getQuestionsBasedOnSection(quizid, sectionName).query(
                    function(response){
                        $scope.total_questions = response.total_questions;
                        $scope.answersModel = {};
                        TestPreviewFactory.addQuestionsForSection(sectionName, response.questions);
                    },
                    function(response){
                        alert('Problem in getting questions from server-side.');
                });
            }
            $scope.addQuestions = function(sectionName){
                $scope.getQuestionsBasedOnSection($scope.sectionNames[0], $scope.quiz);
            }
            $scope.getQuestionsForThisSection = function(sectionName){
                console.log(TestPreviewFactory.getQuestionsForASection(sectionName));
            }
            $scope.showAllQuestions = function(){
                console.log(TestPreviewFactory.showAllQuestionsAdded());
            }

            $scope.changeQuestion = function(count){
                // var question = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                $scope.currentCount = count;
                $scope.currentQuestion = TestPreviewFactory.getAQuestion($scope.selectedSection, count);
                if(isMCQ($scope.currentQuestion.que_type)){
                    $scope.currentOptions = $scope.currentQuestion.options;
                }else{
                    $scope.currentOptions = [];
                }
                console.log('----', $scope.currentOptions);
            }
            $scope.saveAnswer = function(count, answerId){
                if(isMCQ($scope.currentQuestion.que_type))
                {
                    console.log($scope.currentQuestion.content);
                    // if($scope.answersModel[$scope.currentQuestion.id]===answerId){

                    // }else{
                    //     $scope.answersModel[$scope.currentQuestion.id] = answerId;
                    //     console.log($scope.answersModel);
                    //     TestPreviewFactory.saveOrChangeAnswer($scope.selectedSection, count, answerId, newAnswer, oldAnswer);
                    // }
                }
                else{
                    console.log($scope.currentQuestion.content);
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
                    $scope.dataPresent = true;
                }else{
                    $scope.dataPresent = false;
                }
            }catch(e){
                console.log(e);
                $scope.dataPresent = false;
            }
        }])

.controller('UserDataController',['$scope', 'testUserDataFactory','$controller', '$window', function($scope, testUserDataFactory,$controller, $window) {
        	$scope.data = {name: '', email: '', quiz: $window.opener.data.quiz, quiz_name: $window.opener.data.quizName};
        	$scope.postUserDetails = function() {
            	testUserDataFactory.createSubCategory($scope.data);
        	};
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
