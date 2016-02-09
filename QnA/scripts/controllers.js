/* global $ */
angular.module('QnA')
    
    .directive('onlyNum', function() {
      return function(scope, element, attrs) {

         var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
          element.bind("keydown", function(event) {
            console.log($.inArray(event.which,keyCode));
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
     };
  })

    .controller('CookiesController', ['$scope', '$rootScope', '$cookies', '$state', function($scope, $rootScope, $cookies, $state) {
        $rootScope.user = $cookies.get('user');
        $rootScope.username = $cookies.get('username');
        $rootScope.token = $cookies.get('token');
        if($rootScope.token === undefined){
            $state.go('app.login-user');    
        }
    }])


    .controller('IndexController', ['$scope', '$rootScope', '$cookies', '$controller', function($scope, $rootScope, $cookies, $controller) {
        $controller('CookiesController', {$scope : $scope});
    }])


    .controller('LogoutController', ['$scope', '$http', '$state','$cookies', function($scope, $http, $state, $cookies) {
        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    'Authorization' : 'JWT '+$cookies.get('token')
                }
            }
        var data = {};
        $scope.postLogout = function logout() {
          return $http.post('http://localhost:8000/logout/', data, config)
            .success(function(data, status, headers, config) {
            $cookies.remove('token');
            $cookies.remove('username');
            $cookies.remove('user');
            $state.go('app.login-user');
          })
            .error(function logoutErrorFn(data, status, headers, config) {
            console.error('Cannot logout!!!');
          })
        }
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


    .controller("LoginController",[ '$scope', '$rootScope', '$http', '$state', '$cookies', function ($scope, $rootScope, $http, $state, $cookies) {
        $rootScope.user = undefined;
        $rootScope.username = undefined;
        $rootScope.token = undefined;

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
                $cookies.put('token', data.token);
                $cookies.put('username', data.username);
                $cookies.put('user', data.userID);

                $scope.isFormInvalid = false;
                $scope.alertType = "success";
                $scope.alertMsg = "Successfully login.";
                // $route.reload();
                $state.go('app');
            })
            .error(function (data, status, header, config) {
                $scope.isFormInvalid = true;
                $scope.alertType = "danger";
                $scope.alertMsg = "Unable to login. See the errors below.";
                $scope.errors = data.errors? data.errors:'';
            });
        };
    }])


    .controller('CreateQuizController', ['$scope', '$controller', '$state', '$cookies', 'QuestionsFactory','QuizFactory', function($scope, $controller, $state, $cookies, QuestionsFactory, QuizFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
        $scope.postQuiz = function() {
            $scope.createQuizForm.user = $scope.user;
            var response = QuizFactory.createQuiz($cookies.get('token')).save($scope.createQuizForm).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your quiz named " + $scope.createQuizForm.title + " has been created.";
                    $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
                    $scope.quizCreateForm.$setPristine();
                    $state.go('app.create-category',{obj:{'id':response.id, 'name':response.title}});                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the quiz. See below errors.";
                    $scope.errors = response.data;
                }); 
        }


    }])


    .controller('CreateCategoryController', ['$scope','$state', '$controller', '$cookies', 'CategoryFactory', 'QuizFactory','$stateParams', function($scope, $state, $controller, $cookies, CategoryFactory, QuizFactory, $stateParams) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
            $scope.getAllQuiz = QuizFactory.getAllQuiz($cookies.get('token'), $scope.user, "all").query(
            function(response){
                $scope.allQuiz = response;
            },
            function(response){
                $scope.unableToGetAllQuiz = true;
                $scope.errors = "Unable to get your quizzes.";
            });
        }
        $scope._id = $stateParams.obj ? $stateParams.obj.id.toString() : "";
        if($scope._id){
            $scope.isFormInvalid = true;
            $scope.alertType = "info";
            $scope.isCategoryCreated = false;
            $scope.alertMsg = "Please select or create a category first";
            $scope.createCategoryform = {category : "", quiz : $scope._id};
        }else{
            $scope.createCategoryform = {category : "", quiz : ""};
        }

        $scope.postCategory = function() { 
            var response = CategoryFactory.createCategory($cookies.get('token')).save($scope.createCategoryform).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.alertType = "success";
                    $scope.isCategoryCreated = true;
                    $scope.alertMsg = "Your category named " + $scope.createCategoryform.category + " has been created. Now please create a sub-category of it.";
                    $scope.createCategoryform = {category:""};
                    $scope.categoryCreateForm.$setPristine();
                    $state.go('app.create-subcategory', {obj:{'categoryid':response.id, 'categoryname':response.category}});                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.isCategoryCreated = false;
                    $scope.alertMsg = "Unable to create the category - " + $scope.createCategoryform.category + ". See below error.";
                    $scope.errors = response.data;
                    $scope.createCategoryform = {category : "", quiz : [$scope._id]};
                });
        }
    }])


    .controller('CreateSubCategoryController', ['$scope','$state', '$controller', '$cookies', 'CategoryFactory', 'SubCategoryFactory','$stateParams', function($scope, $state, $controller, $cookies, CategoryFactory, SubCategoryFactory, $stateParams) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
            $scope.getAllCategories = CategoryFactory.getAllCategories($cookies.get('token'), $scope.user, "all").query(
            function(response){
                $scope.allCategories = response;
            },
            function(response){
                $scope.unableToGetAllCategories = true;
                $scope.errors = "Unable to get your categories.";
            });
        }
        $scope.categoryid = $stateParams.obj ? $stateParams.obj.categoryid.toString() : "";
        if($scope.categoryid){
            $scope.alertType = "info";
            $scope.alertMsg = "Please select or create a sub-category first";
            $scope.createSubCategoryform = {sub_category_name : "", category : $scope.categoryid};
        }else{
            $scope.createSubCategoryform = {sub_category_name : "", category : ""};
        }
        $scope.postSubCategory = function() {
            var response = SubCategoryFactory.createSubCategory($cookies.get('token')).save($scope.createSubCategoryform).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your sub-category named " + $scope.createSubCategoryform.sub_category_name + " has been created.";   
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the sub-category for " + $scope.createSubCategoryform.sub_category_name + ". See below error.";
                    $scope.errors = response.data;
                });
        }

    }])



    .controller('QuestionsController', ['$scope', '$controller', '$cookies', '$state' ,'QuestionsFactory', function($scope, $controller, $cookies, $state, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.getAllQuestions = QuestionsFactory.getAllQuestions($cookies.get('token'), $scope.user).query(
            function(response) {
                $scope.AllQuizzes = response;
                if($scope.AllQuizzes){
                $scope.questionsLevelInfo = $scope.AllQuizzes[0].questions_level_info;
                $scope.AllQuizzes.shift();
                }
            },
            function(response) {
                $scope.errors = response.data;
            });
        $scope.tab = 1;
        $scope.filterLevel = false;
        $scope.selectTab = function(setTab) {
                $scope.tab = setTab;
                if (setTab === 1) {
                    $scope.filterLevel = false;
                }              
                else if (setTab === 2) {
                    $scope.filterLevel = "easy";
                }
                else if (setTab === 3) {
                    $scope.filterLevel = "medium";
                }
                else if (setTab === 4) {
                    $scope.filterLevel = "hard";
                }
                else {
                    $scope.filterLevel = "Unknown";
                }
            };
        $scope.isTabSelected = function(checkTab) {
                return ($scope.tab === checkTab);
            };

        $scope.hoverOnQuestion = function(questionid){
            $scope.isHoveredOver = true;
        }
        $scope.hoverOutQuestion = function(questionid){
            $scope.isHoveredOver = false;
        }
        $scope.deleteQuestion = function(questionid){
            var response = QuestionsFactory.deleteQuestion($cookies.get('token'), $scope.user, questionid).delete().$promise.then(
                function(response){
                    // $scope.alertType = "success";
                    // $scope.alertMsg = "The question has been delete.";
                    // $('#Q'+questionid).hide();
                    window.location.reload();                   
                },
                function(response) {
                    // $scope.alertType = "danger";
                    // $scope.alertMsg = "Unable to delete the question. See below errors.";
                    $scope.errors = response.data;
                });
        }
    }])


    .controller('CreateQuestionController', ['$scope', '$controller', '$cookies', '$state', 'QuizFactory', 'CategoryFactory', 'SubCategoryFactory', 'QuestionsFactory', function($scope, $controller, $cookies, $state, QuizFactory, CategoryFactory, SubCategoryFactory, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
        $scope.allSubCategories = SubCategoryFactory.getAllSubcategories($cookies.get('token'), $scope.user, 'all', 'all').query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });
        }
        $scope.createQuestionForm = {content:"",explanation:"", level:"easy", answer_order:"random", sub_category:""};
        $scope.postQuestion = function() {
            var response = QuestionsFactory.createQuestion($cookies.get('token')).save($scope.createQuestionForm).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your question has been created.";
                    $scope.createQuestionForm = {content:"",explanation:"", level:"easy", answer_order:"random", sub_category:""};
                    $scope.questionCreateForm.$setPristine();
                    $state.go('app.create-question');                     
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the question. See below errors.";
                    $scope.errors = response.data;
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
        $scope.removeOption = function(op_id){
            if(op_id > 2){
                var all = $scope.optionss;
                $scope.optionss = all.filter(function(el) { return el.optionid != op_id; });
            }
        };

        // Function for download xls file on any type of quetions .... ;)
        $scope.downloadDemoXls = function(que_type, quiz_name){
            console.log(que_type, quiz_name)
                $scope.allSubCategories = QuestionsFactory.getXlsForUpload($cookies.get('token'), que_type, quiz_name).query(
            function(response) {
                console.log('que_type, quiz_name')
            },
            function(response) {
                console.log('ERROR .................')
                // $scope.errors = response.data;
                // $scope.unableToGetAllSubCategories = true;
            });
            };
        }
    }])

    .controller('UpdateQuestionController', ['$scope', '$controller', '$cookies', '$state', '$stateParams', 'QuestionsFactory', function($scope, $controller, $cookies, $state, $stateParams, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.question = QuestionsFactory.getQuestion($cookies.get('token'), $scope.user, $stateParams.questionid).get()
            .$promise.then(
                function(response){
                    $scope.question = response.question;
                    $scope.updateQuestionForm = {content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation };
                },
                function(response) {
                    $scope.unableToGetQuestion = response.data;
                }
            );
        $scope.putQuestion = function() {
            var response = QuestionsFactory.updateQuestion($cookies.get('token'), $scope.user, $stateParams.questionid).update($scope.updateQuestionForm).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your question has been updated.";
                    // $state.go('app.update-question');                     
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the question. See below errors.";
                    $scope.errors = response.data;
                });
        }
    }])
    .controller('UpdateAnswersController', ['$scope', '$controller', '$cookies', '$state', '$stateParams', 'QuestionsFactory', function($scope, $controller, $cookies, $state, $stateParams, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.answers = QuestionsFactory.getAnswers($cookies.get('token'), $scope.user, $stateParams.questionid).get()
            .$promise.then(
                function(response){
                    $scope.answers = response.answers;
                    actualAnswerID = "";
                    optionsContent = {};
                    for(var i=0;i<$scope.answers.options.length;i++){
                        if($scope.answers.options[i].correct){
                            actualAnswerID = $scope.answers.options[i].id;
                        }
                        optionsContent[$scope.answers.options[i].id] = $scope.answers.options[i].content;
                    }
                    $scope.updateAnswersForm = {correctOption : actualAnswerID.toString(), optionsContent : optionsContent};
                    // $scope.updateQuestionForm = {content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation };
                },
                function(response) {
                    $scope.unableToGetAnswers = response.data;
                }
            );
        $scope.putAnswers = function() {
            var response = QuestionsFactory.updateAnswers($cookies.get('token'), $scope.user, $stateParams.questionid).update($scope.updateAnswersForm).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your answers has been updated.";
                    // $state.go('app.update-question');                     
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the answers. See below errors.";
                    $scope.errors = response.data;
                });
        }
    }]);