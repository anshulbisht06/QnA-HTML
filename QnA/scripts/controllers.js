/* global $ */
angular.module('QnA')

    .controller('IndexController', ['$scope', 'indexFactory', function($scope, indexFactory) {
    }])

    .controller('LogoutController', ['$scope', '$http', '$state','$cookies', function($scope, $http, $state, $cookies) {
        $scope.postLogout = function logout() {
          // return $http.post('http://localhost:8000/#/')
            // .success(function(data, status, headers, config) {
            $cookies.remove('token');
            $cookies.remove('email');
            $cookies.remove('username');
            console.log('Logout user now ...')
            $state.go('app.login-user');
          // })
            // .error(function logoutErrorFn(data, status, headers, config) {
            // console.error('Epic failure!');
          // })
        }
    }])

    .controller("LoginController",[ '$scope', '$http', '$state', function ($scope, $http, $state) {
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
                setCookie('token',data.token);
                setCookie('username',data.username);
                setCookie('email',data.email);
                $scope.isFormInvalid = false;
                $scope.alertType = "success";
                $scope.alertMsg = "Successfully login.";
                $state.go('app');
            })
            .error(function (data, status, header, config) {
                $scope.isFormInvalid = true;
                $scope.alertType = "danger";
                $scope.alertMsg = "Unable to login. See the errors below.";
                $scope.errors = data.errors;
            });
        };
    }])

    .controller('UserRegisterController', ['$scope', 'UserRegisterFactory', function($scope, UserRegisterFactory) {
        $scope.registerUserForm = {username:"",email:"",password:"",first_name:""};
        $scope.postRegister = function() { 
            var response = UserRegisterFactory.createUser().save($scope.registerUserForm).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.userRegisterForm.$setPristine();
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.errors = response.data;
                });
        }
    }])     

    

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


    .controller('CreateQuizController', ['$scope', '$state', 'QuestionsFactory','QuizFactory', function($scope, $state, QuestionsFactory, QuizFactory) {
        $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
        $scope.postQuiz = function() {
            var response = QuizFactory.createQuiz().save($scope.createQuizForm).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your quiz named " + $scope.createQuizForm.title + " has been created.";
                    $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
                    $scope.quizCreateForm.$setPristine();
                    $state.go('app.create-category');                     
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
                function(response){
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