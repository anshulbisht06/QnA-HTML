/* global $ */

appmodule
	.controller('QuestionsController', ['$scope', '$controller', '$state', '$http', 'QuestionsFactory', function($scope, $controller, $state, $http, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        QuestionsFactory.getAllQuestions($scope.user).query(
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
            QuestionsFactory.deleteQuestion($scope.user, questionid).delete().$promise.then(
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
            QuestionsFactory.getQuestionUnderQuiz($scope.user, quizid).query(
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
            QuestionsFactory.getQuestionUnderCategory($scope.user, quizid, categoryid).query(
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
            QuestionsFactory.getQuestionUnderSubCategory($scope.user, subcategoryid, false).query(
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
            CategoryFactory.renameCategory().update($scope.categoryRenameForm);
        } 
    }])


    .controller('CreateQuestionController', ['$scope', '$controller', '$state', '$http', 'QuizFactory', 'CategoryFactory', 'SubCategoryFactory', 'QuestionsFactory', 'Upload', function($scope, $controller, $state, $http, QuizFactory, CategoryFactory, SubCategoryFactory, QuestionsFactory, Upload) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
        SubCategoryFactory.getAllSubcategories($scope.user, 'all').query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });
        }
        $scope.upload = function(postUrl, data, figure){
            // $('#progressBarModal').modal('show');
            $scope.error = false;
            Upload.upload({
                    url: baseURL+postUrl,
                    data: { figure: figure, data: data },
                    // headers: {'Authorization': 'JWT ' + $cookies.get('token')},
                    resumeChunkSize: '1MB',
                }).then(function(response) {
                }, function (response) {
                    $scope.error = true;
                }, function(event) {
                    // var percentage = parseInt(100.0 * event.loaded / event.total).toString();
                    // $('#progress-bar').css('width', percentage+'%');
                    // $('#percentage').html(percentage);
                    alert('Question created succesfully!');
                });
        }
        $scope.changeImage = function(){
            $scope.isImageChanged = true;
        }
        $scope.removeImage = function(){
            $scope.isImageChanged = false;
            $scope.figure = undefined;
        }


        if($state.current.name === "app.create-mcq-question")
        {
            $scope.createMCQQuestionForm = {content:"",explanation:"", level:"easy", answer_order:"random", sub_category:"", que_type:"mcq"};
            $scope.postMCQQuestion = function() {
                $scope.upload("question/mcq/create/", $scope.createMCQQuestionForm, $scope.figure);
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
        }
        else if($state.current.name === "app.create-objective-question"){
            $scope.createObjectiveQuestionForm = {content:"",correct:"",explanation:"", level:"easy", sub_category:"", que_type:"objective"};
            $scope.postObjectiveQuestion = function() {
                $scope.upload("question/objective/create/", $scope.createObjectiveQuestionForm, $scope.figure);
            }
            $scope.insertBlank = function(){
                $scope.createObjectiveQuestionForm.content += " <<Answer>> ";
            }
        }


        $scope.downloadDemoXls = function(que_type, sub_cat_info){
            if(sub_cat_info===undefined){
                $scope.noSubCategoryPresent = true;
            }else{
            $http.post(baseURL+"quiz/question/download/xls/", {que_type:que_type,
                sub_cat_info:sub_cat_info}, { responseType: 'arraybuffer' })
              .success(function(data) {
                var file = new Blob([data], { type: 'application/xls' });
                saveAs(file, sub_cat_info.split('>>')[1]+'_'+que_type+'.xls');
            })
            };
        }

        // Function for download xls file on any type of quetions .... ;)
        $scope.uploadFile = function(que_type){
               var file = $scope.myFile;
               if(file===undefined){
                $scope.noFileUploaded = true;
            } else{
                $scope.upload("question/"+que_type+"/bulkupload/", {}, file);                   
            }
            };

    }])

    .controller('UpdateQuestionController', ['$scope', '$controller', '$state', '$stateParams', 'QuestionsFactory', 'Upload', function($scope, $controller, $state, $stateParams, QuestionsFactory, Upload) {
        $controller('CookiesController', {$scope : $scope});
        $scope.serverURL = 'http://localhost:8000';
        $scope.que_type = $stateParams.questionParams.split(':')[1];

        QuestionsFactory.getQuestion($scope.user, $stateParams.questionParams.split(':')[0]).get()
            .$promise.then(
                function(response){
                    $scope.question = response.question;
                    $scope.updateQuestionForm = {content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation, que_type : $scope.question.que_type };
                    if($scope.que_type==='objective')
                        $scope.updateQuestionForm.content = $scope.question.content.replace(/<>/g,'<<Answer>>');
                },
                function(response) {
                    $scope.unableToGetQuestion = response.data;
                }
            );
        $scope.upload = function(postUrl, data){
            // $('#progressBarModal').modal('show');
            $scope.error = false;
            Upload.upload({
                    url: baseURL+postUrl,
                    method : 'PUT',
                    data: { data: data },
                    // headers: {'Authorization': 'JWT ' + $cookies.get('token')},
                }).then(function(response) {
                }, function (response) {
                    $scope.error = true;
                }, function(event) {
                    // var percentage = parseInt(100.0 * event.loaded / event.total).toString();
                    // $('#progress-bar').css('width', percentage+'%');
                    // $('#percentage').html(percentage);
                    alert('Question created succesfully!');
                });
        }

        $scope.putQuestion = function() {
            $scope.upload("quiz/question/"+$scope.user+"/"+$stateParams.questionParams.split(':')[0]+"/", $scope.updateQuestionForm);
        }
    }])


    .controller('UpdateAnswersController', ['$scope', '$controller', '$state', '$stateParams', 'QuestionsFactory', function($scope, $controller, $state, $stateParams, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.que_type = $stateParams.questionParams.split(':')[1];
        QuestionsFactory.getAnswers($scope.user, $stateParams.questionParams.split(':')[0], $stateParams.questionParams.split(':')[1]).get()
            .$promise.then(
                function(response){
                    $scope.answers = response.answers;
                    if($scope.que_type==='mcq'){
                        actualAnswerID = "";
                        optionsContent = {};
                        for(var i=0;i<$scope.answers.options.length;i++){
                            if($scope.answers.options[i].correct){
                                actualAnswerID = $scope.answers.options[i].id;
                            }
                            optionsContent[$scope.answers.options[i].id] = $scope.answers.options[i].content;
                        }
                        $scope.updateAnswersForm = {correctOption : actualAnswerID.toString(), optionsContent : optionsContent};
                    }
                    else if($scope.que_type==='objective'){
                        $scope.updateAnswersForm = { correct: $scope.answers.correct, content: $scope.answers.content, sub_category: $scope.answers.sub_category };
                    }
                    // $scope.updateQuestionForm = {content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation };
                },
                function(response) {
                    $scope.unableToGetAnswers = response.data;
                }
            );
        $scope.putAnswers = function() {
            QuestionsFactory.updateAnswers($scope.user, $stateParams.questionParams.split(':')[0], $stateParams.questionParams.split(':')[1]).update($scope.updateAnswersForm).$promise.then(
                function(response){
                    $state.go('app.questions');                     
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the answers. See below errors.";
                    $scope.errors = response.data;
                });
        }
    }]);