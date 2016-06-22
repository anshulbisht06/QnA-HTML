/* global $ */

appmodule
	.controller('QuestionsController', ['$scope','$filter','$controller', '$state', '$http', 'QuestionsFactory','CategoryFactory', 'SubCategoryFactory', function($scope,$filter, $controller, $state, $http, QuestionsFactory, CategoryFactory, SubCategoryFactory)  {
        $controller('CookiesController', {$scope : $scope});
        $scope.categoryNotSelected = true;
        try{
        var temp = $scope._rest.split(',');
        
        $scope.curPage = 0;
        $scope.pageSize = 10;

        $scope.subCategoryNotSelected = true;
        $scope.createCategoryform = { category_name: "", user: temp[0], hash: temp[1] };
        $scope.createSubCategoryform = { sub_category_name : "", category : $scope.selectedCategoryId, user : temp[0], hash: temp[1] };

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
            QuestionsFactory.deleteQuestion(temp, questionid).delete().$promise.then(
                function(response){
                    window.location.reload();                   
                },
                function(response) {
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

        CategoryFactory.getAllCategories(temp, "all").query(
        function(response){
            $scope.allCategories = response;
        },
        function(response){
            $scope.unableToGetAllCategories = true;
            $scope.errors = "Unable to get your categories.";
        });

        $scope.loadQuestions = function(choice, id) { 
            $("#loader1").css('display', 'block');
            if(choice === 'subcategory'){
                $scope.questionsLevelInfo = [0, 0, 0, 0];
                SubCategoryFactory.getQuestionUnderSubCategory(temp, id, true).query(
                function(response){
                    $scope.questions = response;
                    for(var key in response.questions_type_info){
                        $scope.questionsLevelInfo[0] += response.questions_type_info[key][0];
                        $scope.questionsLevelInfo[1] += response.questions_type_info[key][1];
                        $scope.questionsLevelInfo[2] += response.questions_type_info[key][2];
                        $scope.questionsLevelInfo[3] += response.questions_type_info[key][3];
                    }
                    $scope.numberOfPages = Math.ceil(response.questions.length/$scope.pageSize);
                    $("#loader1").css('display', 'none');
                },
                function(response){
                    console.log(response)
                });
            }
        }

        $scope.selectCategory = function(selectedCategoryId, selectedCategoryName){
            $scope.categoryNotSelected = false;
            $scope.createSubCategoryform = { sub_category_name : "", category : selectedCategoryId, user :temp[0], hash: temp[1] };
            $scope.selectedCategoryId = selectedCategoryId;

            $scope.mainSubcategories = $scope.allSubCategories;
            $scope.selectedCategoryName  = selectedCategoryName;
            SubCategoryFactory.getAllSubcategories(temp, selectedCategoryId, false).query(
                function(response){
                    $scope.allSubCategories = response;
                },
                function(response){
                    $scope.unableToGetAllSubCategories = true;
                });
        }

        $scope.deselectCategory = function(){
            $scope.categoryNotSelected = true;
            delete $scope.selectedCategoryId;
            delete $scope.selectedCategoryName;
            $scope.allSubCategories = $scope.mainSubcategories;
            delete $scope.mainSubcategories;
            $scope.createSubCategoryform = { sub_category_name : "", category : "", user : temp[0], hash: temp[1] };
        }

        // $scope.filterQuiz = function(quizid){
        //     // $scope.filterByQuiz = selectedQuiz;
        //     QuestionsFactory.getQuestionUnderQuiz($scope._rest, quizid).query(
        //     function(response) {
        //         $scope.allQuestions = response;
        //         if($scope.allQuestions){
        //         $scope.questionsLevelInfo = $scope.allQuestions[0].questions_level_info;
        //         $scope.allQuestions.shift();
        //         }
        //     },
        //     function(response) {
        //         $scope.errors = response.data;
        //     });
        // }
        
        SubCategoryFactory.getAllSubcategories(temp, "all", false).query(
        function(response){
            $scope.allSubCategories = response;
        },
        function(response){
            $scope.unableToGetAllSubCategories = true;
            $scope.errors = "Unable to get your SubCategories.";
        });

        $scope.postCategory = function() {
            CategoryFactory.createCategory().save($scope.createCategoryform).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    showAlert('alert-success', "Your category named " + $scope.createCategoryform.category_name + " has been created. Now please create a sub-category of it.");
                    $scope.allCategories.push({ 'id':response.id, 'category_name':response.category_name });                        
                    angular.element(document.querySelector('#createCategoryModal')).modal('hide');
                    $scope.createCategoryform = { category_name : "", user : temp[0], hash: temp[1] };
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    showAlert('alert-danger', "Unable to create the category - " + $scope.createCategoryform.category_name + ".");
                    alert(response.data.errors);
                });
        }

        $scope.postSubCategory = function() {    
            var response = SubCategoryFactory.createSubCategory().save($scope.createSubCategoryform).$promise.then(
                function(response){
                    $scope.allSubCategories.push({ 'id':response.id, 'sub_category_name':response.sub_category_name }); 
                    showAlert('alert-success', "Your sub-category named " + $scope.createSubCategoryform.sub_category_name + " has been created.");
                    angular.element(document.querySelector('#createSubCategoryModal')).modal('hide');
                    $scope.createSubCategoryform = { sub_category_name : "", category : $scope.selectedCategoryId, user : temp[0], hash: temp[1] };
                    // $state.go('app.questions');  
                },
                function(response) {
                    showAlert('alert-danger', "Unable to create the sub-category - " + $scope.createSubCategoryform.sub_category_name + ".");
                    if(response.data['non_field_errors']){
                        alert("This sub-category already exists.");
                    }else{
                        alert(response.data);
                    }
                    angular.element(document.querySelector('#createSubCategoryModal')).modal('hide');
                });
        }

        
        // $scope.filterCategory = function(quizid, categoryid){
        //     // $scope.filterByCategory = selectedCategory;
        //     QuestionsFactory.getQuestionUnderCategory($scope._rest, quizid, categoryid).query(
        //     function(response) {
        //         $scope.allQuestions = response;
        //         if($scope.allQuestions){
        //         $scope.questionsLevelInfo = $scope.allQuestions[0].questions_level_info;
        //         $scope.allQuestions.shift();
        //         }
        //     },
        //     function(response) {
        //         $scope.errors = response.data;
        //     });
        // }

        // $scope.filterSubCategory = function(subcategoryid){
        //     // $scope.filterBySubCategory = selectedSubCategory;
        //     QuestionsFactory.getQuestionUnderSubCategory($scope._rest, subcategoryid, false).query(
        //     function(response) {
        //         $scope.allQuestions = response;
        //         if($scope.allQuestions){
        //         $scope.questionsLevelInfo = $scope.allQuestions[0].questions_level_info;
        //         $scope.allQuestions.shift();
        //         }
        //     },
        //     function(response) {
        //         $scope.errors = response.data;
        //     });
        // }

        // $scope.renameField = function(fieldType, oldValue, newValue){
        //     if(fieldType==='category'){
        //         $('#fieldType').html('Category');
        //         $('#oldValue').html(oldValue);
        //         $scope.categoryRenameForm = { category_name: "", old_category_name : oldValue, quiz: $scope.selectedQuizId };
        //         $('#renameModal').modal('toggle');
        //     }

        // }
        // $scope.renameCategory = function(){
        //     CategoryFactory.renameCategory().update($scope.categoryRenameForm);
        // } 
        }catch(err){}
    }])


    .controller('CreateQuestionController', ['$scope', '$controller', '$state', '$http', 'QuizFactory', 'CategoryFactory', 'SubCategoryFactory', 'QuestionsFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $state, $http, QuizFactory, CategoryFactory, SubCategoryFactory, QuestionsFactory, Upload, ngProgressFactory) {
        $controller('CookiesController', {$scope : $scope});
        try{
        var temp = $scope._rest.split(',');

        SubCategoryFactory.getAllSubcategories(temp, 'all', true).query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data.errors;
                $scope.unableToGetAllSubCategories = true;
            });

        function upload(postUrl, data, figure){
            $scope.changeProgressBar('6px', 'blue');            
            if(data['optioncontent']){
                data['optioncontent'] = JSON.stringify(data['optioncontent']);    
            }
            var finalData = $.extend({}, data, {figure: figure});
            Upload.upload({
                    url: baseURL+postUrl,
                    data: finalData,
                    resumeChunkSize: '5MB',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    showAlert('alert-success', 'Your question has been created.');
                    cleanQuestionForm();
                }, function (response) {
                    if($scope.createMCQQuestionForm!=undefined){
                        $scope.createMCQQuestionForm = { correctoption: undefined, content: $scope.createMCQQuestionForm.content, explanation: $scope.createMCQQuestionForm.explanation, level: $scope.createMCQQuestionForm.level, answer_order: $scope.createMCQQuestionForm.answer_order, sub_category: $scope.createMCQQuestionForm.sub_category, que_type:"mcq", ideal_time: $scope.createMCQQuestionForm.ideal_time, problem_type: $scope.createMCQQuestionForm.problem_type, user:$scope.createMCQQuestionForm.user, hash:$scope.createMCQQuestionForm.hash };
                    }
                    $scope.progressbar.complete();
                    showAlert('alert-danger', 'Problem in creating question. See below errors.');
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
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
            $scope.createMCQQuestionForm = { user:temp[0], content:"", explanation:"", level:"easy", answer_order:"random", sub_category:"", que_type:"mcq", ideal_time:7, problem_type:"correct value" , hash: temp[1]};
            $scope.insertBlank = function(){
                $scope.createMCQQuestionForm.content += " __________ ";
            }
            $scope.postMCQQuestion = function() {
                upload("question/mcq/create/", $scope.createMCQQuestionForm, $scope.figure);
            }

            $scope.optionss = [
                {
                    optionid : 1,
                    content : '',
                },
                {
                    optionid : 2,
                    content : '',
                },
                {
                    optionid : 3,
                    content : '',
                },
                {
                    optionid : 4,
                    content : '',
                },
                ];
            $scope.optionCount = 5;
            $scope.addOptions = function(){
                $scope.optionss.push({                 
                                    optionid : $scope.optionCount,
                                    content : '',
                                    });
                $scope.optionCount = $scope.optionCount + 1;
            }
            $scope.removeOption = function(op_id){
                if(op_id > 4){
                    $scope.optionss = $scope.optionss.filter(function(el) { return el.optionid != op_id; });
                }
            }

            function cleanQuestionForm(){
                $scope.createMCQQuestionForm['explanation'] = '';
                $scope.createMCQQuestionForm['ideal_time'] = 7;
                $scope.createMCQQuestionForm['content'] = '';
                $scope.createMCQQuestionForm['optioncontent'] = {};
                $scope.createMCQQuestionForm['correctoption'] = '';
                $scope.figure = undefined;
                $scope.isImageChanged = false;
            }
        }
        else if($state.current.name === "app.create-objective-question"){
            $scope.createObjectiveQuestionForm = { user:temp[0], content:"", correct:"", explanation:"", level:"easy", sub_category:"", que_type:"objective", hash: temp[1] };
            $scope.postObjectiveQuestion = function() {
                upload("question/objective/create/", $scope.createObjectiveQuestionForm, $scope.figure);
            }
            $scope.insertBlank = function(){
                $scope.createObjectiveQuestionForm.content += " __________ ";
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
            }else{
                upload("question/"+que_type+"/bulkupload/", { hash: temp[1], user: temp[0] }, file);                   
            }
        };

        // function cleanQuestionForm(){
        //     $scope.createObjectiveQuestionForm['explanation'] = '';
        //     $scope.createObjectiveQuestionForm['ideal_time'] = '';
        //     $scope.createObjectiveQuestionForm['content'] = '';
        //     $scope.createObjectiveQuestionForm['correct'] = '';
        //     $scope.figure = undefined;
        //     $scope.isImageChanged = false;
        // }
        }catch(err){}
    }])

    .controller('UpdateQuestionController', ['$scope', '$controller', '$state', '$stateParams', 'QuestionsFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $state, $stateParams, QuestionsFactory, Upload, ngProgressFactory) {
        $controller('CookiesController', {$scope : $scope});
        try{
        var temp = $scope._rest.split(',');
        $scope.que_type = $stateParams.questionParams.split(':')[1];
        QuestionsFactory.getQuestion(temp, $stateParams.questionParams.split(':')[0]).get()
            .$promise.then(
                function(response){
                    $scope.question = response.question;
                    $scope.baseURLImage = baseURLImage;
                    $scope.updateQuestionForm = {hash:temp[1], figure:response.figure, content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation, que_type : $scope.question.que_type, ideal_time: $scope.question.ideal_time, problem_type: $scope.question.problem_type, sub_category: $scope.question.sub_category };
                    if($scope.que_type==='objective')
                        $scope.updateQuestionForm.content = $scope.question.content.replace(/<>/g,'__________');
                    else if($scope.que_type==='comprehension')
                        $scope.updateQuestionForm['heading'] = $scope.question.heading;
                },
                function(response) {
                    $scope.unableToGetQuestion = response.data.errors;
                }
            );

        $scope.changeImage = function(){
            $scope.isImageChanged = true;
        }
        $scope.removeImage = function(){
            $scope.isImageChanged = false;
            $scope.updateQuestionForm.figure = undefined;
        }
        $scope.insertBlank = function(){
            $scope.updateQuestionForm.content += " __________ ";
        }

        $scope.putQuestion = function() {
            upload("quiz/question/"+temp[0]+"/"+$stateParams.questionParams.split(':')[0]+"/", $scope.updateQuestionForm);
        }

        function upload(postUrl, data){
            $scope.changeProgressBar('6px', 'green');
            Upload.upload({
                    url: baseURL+postUrl,
                    data: data,
                    resumeChunkSize: '5MB',
                    method: 'PUT',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    $scope.isImageChanged = false;
                    $scope.question.figure = response.data.figure;
                    $scope.updateQuestionForm = {hash: temp[1], figure: undefined, heading: response.data.heading, content : response.data.content, level : response.data.level, explanation : response.data.explanation, ideal_time: response.data.ideal_time, problem_type: response.data.problem_type };
                    showAlert('alert-success', 'Your question has been updated.');
                }, function (response) {
                    $scope.progressbar.complete();
                    showAlert('alert-danger', 'Problem in updating the question. See below errors.'); 
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }
        }catch(err){}
    }])


    .controller('UpdateAnswersController', ['$scope', '$controller', '$state', '$stateParams', 'QuestionsFactory', function($scope, $controller, $state, $stateParams, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.que_type = $stateParams.questionParams.split(':')[1];
        try{
        var temp = $scope._rest.split(',');       
        
        function modifyTheResult(){
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
                $scope.updateAnswersForm = { correct: $scope.answers.correct, content: $scope.answers.content, sub_category: $scope.answers.sub_category, sub_category_name: $scope.answers.sub_category_name };
            }
        }

        QuestionsFactory.getAnswers(temp, $stateParams.questionParams.split(':')[0], $stateParams.questionParams.split(':')[1]).get()
            .$promise.then(
                function(response){
                    $scope.answers = response.answers;
                    modifyTheResult();
                },
                function(response) {
                    $scope.unableToGetAnswers = response.data.errors;
                }
            );
        $scope.putAnswers = function() {
            QuestionsFactory.updateAnswers(temp, $stateParams.questionParams.split(':')[0], $stateParams.questionParams.split(':')[1]).update($scope.updateAnswersForm).$promise.then(
                function(response){
                    $scope.answers = response;
                    modifyTheResult();
                    showAlert('alert-success', 'Your answers have been updated.');
                },
                function(response) {
                    showAlert('alert-danger', 'Problem in updating the answers. See below errors.'); 
                    $scope.errors = response.data.errors;
                });
        }
        }catch(err){}
    }]);