/* global $ */
angular.module('QnA')
    .controller('IndexController', ['$scope', 'indexFactory', function($scope, indexFactory) {
    }])   
    .controller("LoginController",function ($scope, $http, $window) {
        // $cookies.myFavorite = 'oatmeal';
        // console.log($cookies.myFavorite)
        $scope.postLogin = function () {
           // use $.param jQuery function to serialize data from JSON 
            var data = $.param({
                username: $scope.username,
                password: $scope.password
            });
            // $window.localStorage.token
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://localhost:8000/login/', data, config)
            .success(function (data, status, headers, config) {
                $scope.postDataResponse = data;
                $window.localStorage.token = data.token;
                $window.localStorage.username = data.username;
                $window.localStorage.email = data.email;
                $scope.isFormInvalid = false;
                $scope.alertType = "success";
                $scope.alertMsg = "Successfully login.";
                alert($window.localStorage.token);
                $window.location.href = '/index.html'
            })
            .error(function (data, status, header, config) {
                $scope.isFormInvalid = true;
                $scope.alertType = "danger";
                $scope.alertMsg = "Unable to login.";
                $scope.errors = response.data;
            });
        };
    })

    .controller('QuestionsController', ['$scope', 'allQuestionsFactory', function($scope, allQuestionsFactory) {
        $scope.allQuestions = allQuestionsFactory.questions;
        $scope.totalQuestions = allQuestionsFactory.totalQuestions;
        $scope.totalHardQuestions = allQuestionsFactory.totalHardQuestions;
        $scope.totalEasyQuestions = allQuestionsFactory.totalEasyQuestions;
        $scope.totalMediumQuestions = allQuestionsFactory.totalMediumQuestions;
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
    .controller('CreateQuestionController', ['$scope', 'createQuestionFactory', function($scope, createQuestionFactory) {
    }])
    .controller('CreateQuizController', ['$scope', 'createQuizFactory', function($scope, createQuizFactory) {
        $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
        $scope.postQuiz = function() { 
            var response = QuizFactory.createQuiz().save($scope.createQuizForm).$promise.then(
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
    .controller('CreateCategoryController', ['$scope', 'CategoryFactory', 'QuizFactory', function($scope, CategoryFactory, QuizFactory) {
        $scope.createCategoryform = {category:""};
        $scope.postCategory = function() { 
            $scope.createdCategory = $scope.createCategoryform.category;
            var response = CategoryFactory.createCategory().save($scope.createCategoryform).$promise.then(
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
            var response = CategoryFactory.createSubCategory().save($scope.subcreateCategoryform).$promise.then(
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
        $scope.getAllQuiz = QuizFactory.getAllQuiz().query(
                function(response){
                    console.log(response);                    
                },
                function(response) {
                    console.log('error');
                });
    }])
    .controller('QuestionsController', ['$scope', 'QuestionsFactory', function($scope, QuestionsFactory) {
        $scope.allQuestions = QuestionsFactory.questions;
        $scope.totalQuestions = QuestionsFactory.totalQuestions;
        $scope.totalHardQuestions = QuestionsFactory.totalHardQuestions;
        $scope.totalEasyQuestions = QuestionsFactory.totalEasyQuestions;
        $scope.totalMediumQuestions = QuestionsFactory.totalMediumQuestions;
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
        $scope.getAllQuestions = QuestionsFactory.getAllQuestions().query(
            function(response) {
                $scope.allQuestions = response;
            },
            function(response) {
                $scope.errors = response.data;
                console.log($scope.errors);
            });
        console.log($scope.getAllQuestions); 
    }])
    .controller('CreateQuestionController', ['$scope', 'QuestionsFactory', function($scope, QuestionsFactory) {
        $scope.allSubCategories = QuestionsFactory.getAllSubcategories().query(
            function(response) {
                $scope.isSubCategoryEmpty = false;
            },
            function(response) {
                $scope.errors = response.data;
                console.log($scope.errors);
                $scope.isSubCategoryEmpty = true;
            });
        $scope.postQuestion = function() {
            var response = QuestionsFactory.createQuestion().save($scope.createQuestionForm).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your question has been created.";
                    $scope.createQuestionForm = {content:"",explanation:""};
                    $scope.questionCreateForm.$setPristine();
                    $scope.isFormInvalid = false;
                    // $state.go('app.questions');                     
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the question. See below errors.";
                    $scope.errors = response.data;
                    $scope.isFormInvalid = true;
                });
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
    }]);