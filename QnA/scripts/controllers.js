/* global $ */
angular.module('QnA')
    .controller('IndexController', ['$scope', 'indexFactory', function($scope, indexFactory) {
    }])
    .controller('QuestionsController', ['$scope', 'allQuestionsFactory', function($scope, allQuestionsFactory) {
        $scope.allQuestions = allQuestionsFactory.questions;
        $scope.totalQuestions = allQuestionsFactory.totalQuestions;
        $scope.totalHardQuestions = totalHardQuestions;
        $scope.totalEasyQuestions = totalEasyQuestions;
        $scope.totalMediumQuestions = totalMediumQuestions;
        $scope.tab = 1;
        $scope.filterLevel = false;
        $scope.selectTab = function(setTab) {
                $scope.tab = setTab;
                if (setTab === 1) {
                    $scope.filterLevel = false;
                }              
                else if (setTab === 2) {
                    $scope.filterLevel = "E";
                }
                else if (setTab === 3) {
                    $scope.filterLevel = "M";
                }
                else if (setTab === 4) {
                    $scope.filterLevel = "H";
                }
                else {
                    $scope.filterLevel = "U";
                }
            };
        $scope.isTabSelected = function(checkTab) {
                return ($scope.tab === checkTab);
            };       
    }])
    .controller('CreateQuizController', ['$scope', 'createQuizFactory', function($scope, createQuizFactory) {
        $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
        $scope.postQuiz = function() { 
            var response = createQuizFactory.createQuiz().save($scope.createQuizForm).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your quiz named " + $scope.createQuizForm.title + " has been created.";
                    $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
                    $scope.quizCreateForm.$setPristine();
                    // $state.go('app.create-category');                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the quiz. See below errors.";
                    $scope.errors = response.data;
                });
        }
    }])
    .controller('CreateCategoryController', ['$scope', 'createCategoryFactory', function($scope, createCategoryFactory) {
        $scope.createCategoryform = {category:""};
        $scope.postCategory = function() { 
            $scope.createdCategory = $scope.createCategoryform.category;
            var response = createCategoryFactory.createCategory().save($scope.createCategoryform).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.alertType = "success";
                    $scope.isCategoryCreated = true;
                    $scope.alertMsg = "Your category named " + $scope.createdCategory + " has been created. Now please create a sub-category of it.";
                    $scope.createCategoryform = {category:""};
                    $scope.categoryCreateForm.$setPristine();
                    // $state.go('app.create-category');                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.isCategoryCreated = false;
                    $scope.alertMsg = "Unable to create the category - " + $scope.createdCategory + ". See below error.";
                    $scope.errors = response.data;
                });
        }
        $scope.postSubCategory = function() {
            var response = createCategoryFactory.createSubCategory().save($scope.subcreateCategoryform).$promise.then(
                function(response){
                    $scope.isFormInvalid1 = false;
                    $scope.alertType = "success";
                    $scope.createCategory = $scope.subcreateCategoryform.createdCategory;
                    $scope.alertMsg = "Your sub-category named " + $scope.subcreateCategoryform.sub_category + " has been created for " + $scope.createdCategory + ".";   
                },
                function(response) {
                    $scope.isFormInvalid1 = true;
                    $scope.alertType = "danger";
                    $scope.createCategory = $scope.subcreateCategoryform.createdCategory;
                    $scope.alertMsg = "Unable to create the sub-category for " + $scope.createdCategory + ". See below error.";
                    $scope.errors = response.data;
                });
        }
    }]);