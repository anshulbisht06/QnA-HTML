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


    .controller('LogoutController', ['$scope', '$http', '$state','$cookies', 'baseURL', function($scope, $http, $state, $cookies, baseURL) {
        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    'Authorization' : 'JWT '+$cookies.get('token')
                }
            }
        var data = {};
        $scope.postLogout = function logout() {
          return $http.post(baseURL+'logout/', data, config)
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
            UserRegisterFactory.createUser().save($scope.registerUserForm).$promise.then(
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


    .controller("LoginController",[ '$scope', '$rootScope', '$http', '$state', '$cookies', 'baseURL', function ($scope, $rootScope, $http, $state, $cookies, baseURL) {
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

            $http.post(baseURL+'login/', data, config)
            .success(function (data, status, headers, config) {
                $scope.postDataResponse = data;
                var expireDate = new Date();

                if($scope.remember){
                    expireDate.setDate(expireDate.getDate() + 1);
                }

                options={
                    path : '/',
                    secure: true,
                    expires: expireDate

                };

                $cookies.put('token', data.token);
                $cookies.put('username', data.username);
                $cookies.put('user', data.userID);

                $scope.isFormInvalid = false;
                // $scope.alertType = "success";
                // $scope.alertMsg = "Successfully login.";
                // $route.reload();

                $state.go('app.all-quiz');
            })
            .error(function (data, status, header, config) {
                $scope.isFormInvalid = true;
                $scope.alertType = "danger";
                $scope.alertMsg = "Unable to login. See the errors below.";
                $scope.errors = data.errors? data.errors:'';
            });
        };
    }])


    .controller('CreateQuizController', ['$scope', '$controller', '$state', '$cookies', 'QuestionsFactory','QuizFactory', 'CategoryFactory', function($scope, $controller, $state, $cookies, QuestionsFactory, QuizFactory, CategoryFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
        $scope.postQuiz = function() {
            $scope.createQuizForm.user = $scope.user;
            QuizFactory.createQuiz($cookies.get('token')).save($scope.createQuizForm).$promise.then(
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
        $scope.getCategories = function(quizid, quiztitle){
            CategoryFactory.getAllCategories($cookies.get('token'), $scope.user, parseInt(quizid)).query(
            function(response){
                $scope.allCategories = response;
                $scope.quiztitle = quiztitle;
                $('#categoriesModal').modal('toggle');
            },
            function(response){
                $scope.unableToGetAllCategories = "Unable to get your categories.";
        });
        }
    }])


    .controller('CreateCategoryController', ['$scope','$state', '$controller', '$cookies', 'CategoryFactory', 'QuizFactory','$stateParams', function($scope, $state, $controller, $cookies, CategoryFactory, QuizFactory, $stateParams) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
            QuizFactory.getAllQuiz($cookies.get('token'), $scope.user, "all").query(
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
            CategoryFactory.createCategory($cookies.get('token')).save($scope.createCategoryform).$promise.then(
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
        CategoryFactory.getAllCategories($cookies.get('token'), $scope.user, "all").query(
        function(response){
            $scope.allCategories = response;
        },
        function(response){
            $scope.unableToGetAllCategories = true;
            $scope.errors = "Unable to get your categories.";
        });
        $scope.categoryid = $stateParams.obj ? $stateParams.obj.categoryid.toString() : "";
        $scope.createSubCategoryform = { sub_category_name : "", category : "", user : $scope.user };
        if($scope.categoryid){
            $scope.alertType = "info";
            $scope.alertMsg = "Please select or create a sub-category first";
            $scope.createSubCategoryform.category = $scope.categoryid;
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


    .controller('QuestionsController', ['$scope', '$controller', '$cookies', '$state', '$http', 'QuestionsFactory', function($scope, $controller, $cookies, $state, $http, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        QuestionsFactory.getAllQuestions($cookies.get('token'), $scope.user).query(
            function(response) {
                $scope.questions = response;
                if($scope.questions){
                $scope.questionsLevelInfo = $scope.questions.questions_level_info;
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
        $scope.isHoveredOver = {};
        $scope.hoverOnQuestion = function(questionid){
            $scope.isHoveredOver[questionid] = true;
        }
        $scope.hoverOutQuestion = function(questionid){
            $scope.isHoveredOver[questionid] = false;
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
        $scope.quizNotSelected = true;
        $scope.quizSelected = function(selectedQuizId, selectedQuizTitle, selectedCategories){
            $scope.quizNotSelected = false;
            $scope.selectedQuizId = selectedQuizId;
            $scope.selectedQuizTitle = selectedQuizTitle;
            $scope.categoryNotSelected = true;
            $scope.categorieslist = selectedCategories;
        } 
        $scope.quizDeselected = function(){
            $scope.quizNotSelected = true;
            delete $scope.selectedQuizId;
            delete $scope.selectedQuizTitle;
            $scope.categoryNotSelected = true;
            delete $scope.categorieslist;
        }
        $scope.categorySelected = function(selectedCategoryId, selectedCategoryName, selectedSubCategories){
            $scope.quizNotSelected = false;
            $scope.categoryNotSelected = false;
            $scope.selectedCategoryId = selectedCategoryId;
            $scope.selectedCategoryName = selectedCategoryName;
            $scope.subcategoryNotSelected = true;
            $scope.subcategorieslist = selectedSubCategories;
        }
        $scope.categoryDeselected = function(){
            $scope.quizNotSelected = false;
            $scope.categoryNotSelected = true;
            delete $scope.subcategorieslist;
        }
        $scope.filterQuiz = function(quizid){
            // $scope.filterByQuiz = selectedQuiz;
            QuestionsFactory.getQuestionUnderQuiz($cookies.get('token'), $scope.user, quizid).query(
            function(response) {
                $scope.allQuestions = response;
                if($scope.allQuestions){
                $scope.questionsLevelInfo = $scope.allQuestions[0].questions_level_info;
                $scope.allQuestions.shift();
                }
            },
            function(response) {
                $scope.errors = response.data;
            });
        }

        $scope.filterCategory = function(quizid, categoryid){
            // $scope.filterByCategory = selectedCategory;
            QuestionsFactory.getQuestionUnderCategory($cookies.get('token'), $scope.user, quizid, categoryid).query(
            function(response) {
                $scope.allQuestions = response;
                if($scope.allQuestions){
                $scope.questionsLevelInfo = $scope.allQuestions[0].questions_level_info;
                $scope.allQuestions.shift();
                }
            },
            function(response) {
                $scope.errors = response.data;
            });
        }
        $scope.filterSubCategory = function(subcategoryid){
            // $scope.filterBySubCategory = selectedSubCategory;
            QuestionsFactory.getQuestionUnderSubCategory($cookies.get('token'), $scope.user, subcategoryid, false).query(
            function(response) {
                $scope.allQuestions = response;
                if($scope.allQuestions){
                $scope.questionsLevelInfo = $scope.allQuestions[0].questions_level_info;
                $scope.allQuestions.shift();
                }
            },
            function(response) {
                $scope.errors = response.data;
            });
        }
        $scope.renameField = function(fieldType, oldValue, newValue){
            if(fieldType==='category'){
                $('#fieldType').html('Category');
                $('#oldValue').html(oldValue);
                $scope.categoryRenameForm = { category_name: "", old_category_name : oldValue, quiz: $scope.selectedQuizId };
                $('#renameModal').modal('toggle');
            }

        }
        $scope.renameCategory = function(){
            console.log($scope.categoryRenameForm);
            CategoryFactory.renameCategory($cookies.get('token')).update($scope.categoryRenameForm);
        } 
    }])


    .controller('CreateQuestionController', ['$scope', '$controller', '$cookies', '$state', 'QuizFactory', 'CategoryFactory', 'SubCategoryFactory', 'QuestionsFactory', function($scope, $controller, $cookies, $state, QuizFactory, CategoryFactory, SubCategoryFactory, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
        SubCategoryFactory.getAllSubcategories($cookies.get('token'), $scope.user, 'all').query(
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
    }])
    .controller('XlsHandlerController',['$scope', '$http', 'fileUpload', function($scope, $http, fileUpload){
        // Function for download xls file on any type of quetions .... ;)
        $scope.downloadDemoXls = function(que_type, sub_cat_info){
            if(sub_cat_info===undefined){
                // $scope.noSubCategoryPresent = true;
            }else{
            $http.post(baseURL+"quiz/question/download/xls/", {que_type:que_type,
                sub_cat_info:sub_cat_info}, { responseType: 'arraybuffer' })
              .success(function(data) {
                var file = new Blob([data], { type: 'application/xls' });
                saveAs(file, sub_cat_info.split('>>')[1]+'.xls');
            })
            };
        }
        $scope.uploadFile = function(){
               var file = $scope.myFile;
               if(file===undefined){
                // $scope.noSubCategoryPresent = true;
            } else{            
               var uploadUrl = baseURL+"question/test/";
               fileUpload.uploadFileToUrl(file, uploadUrl);
            }
            };
    }])

    .controller('UpdateQuestionController', ['$scope', '$controller', '$cookies', '$state', '$stateParams', 'QuestionsFactory', function($scope, $controller, $cookies, $state, $stateParams, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        QuestionsFactory.getQuestion($cookies.get('token'), $scope.user, $stateParams.questionid).get()
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
            QuestionsFactory.updateQuestion($cookies.get('token'), $scope.user, $stateParams.questionid).update($scope.updateQuestionForm).$promise.then(
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
        QuestionsFactory.getAnswers($cookies.get('token'), $scope.user, $stateParams.questionid).get()
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
            QuestionsFactory.updateAnswers($cookies.get('token'), $scope.user, $stateParams.questionid).update($scope.updateAnswersForm).$promise.then(
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
    }])


    .controller('ViewUpdateQuizController', ['$scope', '$controller', '$cookies', '$state', '$stateParams', 'QuizFactory', function($scope, $controller, $cookies, $state, $stateParams, QuizFactory) {
            $controller('CookiesController', {$scope : $scope});
            QuizFactory.getQuiz($cookies.get('token'), $scope.user, $stateParams.quizid).get()
            .$promise.then(
                function(response){
                    $scope.quiz = response;
                },
                function(response) {
                    $scope.unableToGetQuiz = response.data;
                }
            );
            $scope.editorEnabled = false;
  
            $scope.enableEditor = function() {
                $scope.editorEnabled = true;
            };

            $scope.putQuiz = function() {
                QuizFactory.updateQuiz($cookies.get('token'), $scope.user, $stateParams.quizid).update($scope.quiz).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your quiz details has been updated.";
                    $scope.editorEnabled = false;
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the quiz details. See below errors.";
                    $scope.errors = response.data;
                    $scope.editorEnabled = true;
                });
            }
        }])
    

    .controller('PreviewQuizController', ['$scope', '$controller', '$cookies', '$state', '$stateParams', '$http', function($scope, $controller, $cookies, $state, $stateParams, $http) {
            $scope._data = undefined;
            $scope.getQuizPreview = function() {
                $http({
                  method: 'GET',
                  url: baseURL+'stack/get/test/1/'
                }).then(function successCallback(response) {
                    $scope.all_que_data = response.data;
                  }, function errorCallback(response) {
                    console.log('error :(')
                  });
            };  
            
        }])


    .controller('AddQuizStackController', ['$scope', '$controller', '$cookies', '$stateParams', '$compile', 'QuizStackFactory', 'SubCategoryFactory', 'QuestionsFactory', function($scope, $controller, $cookies, $stateParams, $compile, QuizStackFactory, SubCategoryFactory, QuestionsFactory) {
            $controller('CookiesController', {$scope : $scope});
            SubCategoryFactory.getAllSubcategories($cookies.get('token'), $scope.user, 'all').query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });
            QuizStackFactory.getQuizStack($cookies.get('token'), $stateParams.quizid, 'all').query(
            function(response) {
                // console.log(response);
                for(i=0;i<response.length;i++){
                html = '<tr id="oldstackrow'+i+'">'+
                        '<td style="width:130px;">'+response[i].section_name+'</td>'+
                        '<td style="width:200px;">'+$('#subcategory'+response[i].subcategory).text()+'</td>'+
                        '<td style="width:130px;">'+response[i].level+'</td>'+
                        '<td style="width:130px;">'+response[i].que_type+'</td>'+
                        '<td style="width:130px;">'+response[i].no_questions+'</td>'+
                        '<td style="width:130px;">'+response[i].duration+'</td>'+
                        '<td style="width:130px;">'+response[i].istimed+'</td>'+
                        '<td style="width:130px;">'+response[i].correct_grade+'</td>'+
                        '<td style="width:130px;">'+response[i].incorrect_grade+'</td>'+
                        '<td style="width:130px;">'+response[i].question_order+'</td>'+
                        '<td style="width:60px;"><a href="javascript:void(0);"><span class="glyphicon glyphicon-trash removefromstackbutton" style="font-size:20px;" ng-click="removeFromStackAndSave('+response[i].id+')"></span></a></td>'+
                    +'</tr>';
                angular.element(document.querySelector('#existingQuestionsRow')).append($compile(html)($scope));
                }
            },
            function(response) {
                $scope.unableToGetAllSavedStacks= true;
            });
            $scope.selectedSubCategoryDropdown = "";
            selectNoQuestions = function(noOfQuestions){
                result = '<select class="form-control" name="no_questions" id="no_questions'+$scope.count+'">';
                for(var i=0;i<noOfQuestions;i++){
                    result += '<option value="'+(i+1)+'">'+(i+1)+'</option>';
                }
                return result + '</select>';
            }
            $scope.count = 0;
            $scope.changeNoQuestions = function(count){
                result = '';
                levelInfo = { 'easy' : 0, 'medium' : 1, 'hard' : 2, 'total' : 3 };
                splitValue = $scope.modelForLevels[count].split('-');
                angular.element(document.querySelector('#levelwiseqs'+count)).html(selectNoQuestions(QuizStackFactory.getSelectedLevelQuestions(count)[levelInfo[splitValue[0]]]));
            }
            $scope.modelForLevels = [];
            $scope.duration = [];
            stack = {}
            $scope.selectSubCategory = function(subCategoryId){
                $scope.finalStack = [];
                QuestionsFactory.getQuestionUnderSubCategory($cookies.get('token'), $scope.user, subCategoryId, true).query(
                    function(response) {
                        $scope.selectedSubCategory = response[0];
                        console.log($scope.selectedSubCategory);
                        s = {}
                        s[$scope.count] = {
                                'quiz' : $stateParams.quizid,
                                'subcategory' : $scope.selectedSubCategory['subcategory_id'],
                                'section_name' : $scope.selectedSubCategory['section_name'],
                                'level' : $scope.selectSubCategory['level'],
                                'que_type' : $scope.selectSubCategory['que_type'],
                                'no_questions' : $scope.selectSubCategory['no_questions'],
                                'duration' : $scope.selectSubCategory['duration'],
                                'istimed' : $scope.selectSubCategory['istimed'],
                                'correct_grade' : $scope.selectSubCategory['correct_grade'],
                                'incorrect_grade' : $scope.selectSubCategory['incorrect_grade'],
                                'question_order' : $scope.selectSubCategory['question_order'],

                            }
                        QuizStackFactory.addToFinalStack(s);
                        QuizStackFactory.addSelectedLevelQuestions($scope.selectedSubCategory['questions_level_info']);
                        initialnoOfQuestionIndex = $scope.selectedSubCategory['questions_level_info'].findIndex(val=>val>0);
                        // initialLevel = { 0 : 'easy', 1 : 'medium' , 2 : 'hard' , 3 : 'total' }[initialnoOfQuestionIndex];
                        levelHtml = '<select class="form-control" name="level" id="level'+$scope.count+'" ng-model="modelForLevels['+$scope.count+']" ng-change="changeNoQuestions('+$scope.count+')"><option value="" disabled>Select here</option>';
                        for(var i=0;i<$scope.selectedSubCategory['level'].length;i++){
                            levelHtml += '<option value="'+$scope.selectedSubCategory['level'][i]+'-'+i+'">'+$scope.selectedSubCategory['level'][i]+'</option>';
                        }
                        levelHtml += '</select>';
                        html = '<tr id="newstackrow'+$scope.count+'">'+
                                    '<td style="width:130px;"><input type="text" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="section_name" value="'+$scope.selectedSubCategory['section_name']+'" readonly></td>'+
                                    '<td style="width:200px;">'+$scope.selectedSubCategory['subcategory']+'</td>'+
                                    '<td style="width:130px;">'+levelHtml+'</td>'+
                                    '<td style="width:130px;"><select class="form-control" id="que_type'+$scope.count+'" name="que_type"><option value="mcq">mcq</option><option value="objective">objective</option></select></td>'+
                                    '<td style="width:130px;" id="levelwiseqs'+$scope.count+'">'+selectNoQuestions($scope.selectedSubCategory['questions_level_info'][initialnoOfQuestionIndex])+'</td>'+
                                    '<td style="width:130px;"><input type="number" min="1" max="180" class="form-control" id="duration'+$scope.count+'" ondblclick="makeEditable(this)" onblur="makeUneditable(this); name="duration" value="'+$scope.selectedSubCategory['duration']+'" readonly></td>'+
                                    '<td style="width:130px;"><select class="form-control" name="istimed" id="istimed'+$scope.count+'"><option value="yes">yes</option><option value="no">no</option></select></td>'+
                                    '<td style="width:130px;"><input type="number" min="1" max="100" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="correct_grade" id="correct_grade'+$scope.count+'" value="'+$scope.selectedSubCategory['correct_grade']+'" readonly></td>'+
                                    '<td style="width:130px;"><input type="number" min="-100" max="100" class="form-control" ondblclick="makeEditable(this)"onblur="makeUneditable(this)" name="incorrect_grade" id="incorrect_grade'+$scope.count+'" value="'+$scope.selectedSubCategory['incorrect_grade']+'" readonly></td>'+
                                    '<td style="width:130px;"><select class="form-control" name="question_order" id="question_order'+$scope.count+'"><option value="random">random</option><option value="content">content</option></select></td>'+
                                    '<td style="width:60px;"><a href="javascript:void(0);"><span class="glyphicon glyphicon-remove-circle removefromstackbutton" ng-click="removeFromStack('+$scope.count+')"></span></a></td>'+
                                    '<td style="width:60px;"><a href="javascript:void(0);"><span class="glyphicon glyphicon-ok-circle addtostackbutton" ng-click="addToStackAndSave('+$scope.count+')"></span></a></td>'+
                                +'</tr>';
                        angular.element(document.querySelector('#selectedQuestionsRow')).append($compile(html)($scope));
                        $scope.selectedSubCategoryDropdown = "";
                        $scope.count += 1;
                    },
                    function(response) {
                        $scope.errors = response.data;
                    });
            }
            $scope.addToStackAndSave = function(count){
                r = QuizStackFactory.getValueFromStack(count);
                r[count]['level'] = document.querySelector("#level"+count).value.split('-')[0];
                if(r[count]['level']===""){
                    alert('Fill all fields correctly!');
                    return;
                }
                r[count]['que_type'] = document.querySelector("#que_type"+count).value;
                r[count]['no_questions']  = document.querySelector("#levelwiseqs"+count+" select").value;
                r[count]['duration']  = document.querySelector("#duration"+count).value;
                if(document.querySelector("#istimed"+count).value==='yes')
                    r[count]['istimed'] = true;
                else
                    r[count]['istimed'] = false;
                r[count]['correct_grade'] = document.querySelector("#correct_grade"+count).value;
                r[count]['incorrect_grade'] = document.querySelector("#incorrect_grade"+count).value;
                r[count]['question_order'] = document.querySelector("#question_order"+count).value;
                QuizStackFactory.updateFinalStack(count, r[count]);

                QuizStackFactory.addToQuizStack($cookies.get('token')).save(QuizStackFactory.getValueFromStack(count)[count]).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your quiz stack has been updated.";
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the quiz stack.";
                    alert(response.data);
                });
            }
            $scope.removeFromStack = function(count){
                QuizStackFactory.removeFromStack(count);
                document.querySelector("#newstackrow"+count).style.display = "none";
            }
            $scope.removeFromStackAndSave = function(quizstackid){
                console.log(quizstackid);
            }
            $scope.go = function(){
                console.log(QuizStackFactory.showStack());
            }
        }]);

    

