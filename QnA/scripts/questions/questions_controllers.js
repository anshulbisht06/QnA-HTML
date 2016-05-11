/* global $ */

appmodule
	.controller('QuestionsController', ['$scope','$filter','$controller', '$state', '$http', 'QuestionsFactory','CategoryFactory', 'SubCategoryFactory', function($scope,$filter, $controller, $state, $http, QuestionsFactory, CategoryFactory, SubCategoryFactory)  {
        $controller('CookiesController', {$scope : $scope});
        $scope.categoryNotSelected = true;
        
        $scope.curPage = 0;
        $scope.pageSize = 10;

        $scope.subCategoryNotSelected = true;
        $scope.createCategoryform = { category_name: "", user: $scope.user };
        $scope.createSubCategoryform = { sub_category_name : "", category : $scope.selectedCategoryId, user : $scope.user };

        // QuestionsFactory.getAllQuestions($scope.user).query(
        //     function(response) {
        //         $scope.questions = response;
        //         if($scope.questions){
        //         $scope.questionsLevelInfo = $scope.questions.questions_level_info;
        //         }
        //     },
        //     function(response) {
        //         $scope.errors = response.data;
        //     });  

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

        CategoryFactory.getAllCategories($scope.user, "all").query(
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
            SubCategoryFactory.getQuestionUnderSubCategory($scope.user, id, false).query(
            function(response){
                $scope.questions = response;
                $scope.questionsLevelInfo = $scope.questions.questions_level_info;
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
            $scope.createSubCategoryform = { sub_category_name : "", category : selectedCategoryId, user : $scope.user };
            $scope.selectedCategoryId = selectedCategoryId;

            $scope.mainSubcategories = $scope.allSubCategories;
            $scope.selectedCategoryName  = selectedCategoryName;
            SubCategoryFactory.getAllSubcategories($scope.user, selectedCategoryId, false).query(
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
            $scope.createSubCategoryform = { sub_category_name : "", category : "", user : $scope.user };
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
        
        SubCategoryFactory.getAllSubcategories($scope.user, "all", false).query(
        function(response){
            $scope.allSubCategories = response;
        },
        function(response){
            $scope.unableToGetAllSubCategories = true;
            $scope.errors = "Unable to get your SubCategories.";
        });

        $scope.createCategoryform = {category_name : "",user : $scope.user};
        $scope.postCategory = function() {
            CategoryFactory.createCategory().save($scope.createCategoryform).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your category named " + $scope.createCategoryform.category_name + " has been created. Now please create a sub-category of it.";
                    $scope.allCategories.push({ 'id':response.id, 'category_name':response.category_name });                        
                    // $scope.$apply();
                    angular.element(document.querySelector('#createCategoryModal')).modal('hide');
                    $scope.createCategoryform = { category_name : "", user : $scope.user };
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the category - " + $scope.createCategoryform.category_name;
                    alert(response.data);
                });
                setTimeout(closeAlert, 5000);
        }

        $scope.postSubCategory = function() {    
            var response = SubCategoryFactory.createSubCategory().save($scope.createSubCategoryform).$promise.then(
                function(response){
                    $scope.alertType = "success";
                    $scope.alertMsg = "Your sub-category named " + $scope.createSubCategoryform.sub_category_name + " has been created.";
                    $scope.allSubCategories.push({ 'id':response.id, 'sub_category_name':response.sub_category_name });                        
                    // $scope.$apply();
                    angular.element(document.querySelector('#createSubCategoryModal')).modal('hide');
                    $scope.createSubCategoryform = { sub_category_name : "", category : $scope.selectedCategoryId, user : $scope.user };
                    // $state.go('app.questions');  
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to create the sub-category - " + $scope.createSubCategoryform.sub_category_name + ".";
                    if(response.data['non_field_errors']){
                        alert("The sub-category already exists.");
                    }else{
                        alert(response.data);
                    }
                    angular.element(document.querySelector('#createSubCategoryModal')).modal('hide');
                });
                setTimeout(closeAlert, 5000);
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


    .controller('CreateQuestionController', ['$scope', '$controller', '$state', '$http', 'QuizFactory', 'CategoryFactory', 'SubCategoryFactory', 'QuestionsFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $state, $http, QuizFactory, CategoryFactory, SubCategoryFactory, QuestionsFactory, Upload, ngProgressFactory) {
        $controller('CookiesController', {$scope : $scope});
        SubCategoryFactory.getAllSubcategories($scope.user, 'all', true).query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });

        $scope.upload = function(postUrl, data, figure){
            $scope.progressbar.start();
            $scope.progressbar.setHeight('6px');
            $scope.progressbar.setColor('blue');
            
            if(data['optioncontent']){
                data['optioncontent'] = JSON.stringify(data['optioncontent']);    
            }
            var settings = $.extend({}, data, {figure: figure});
            Upload.upload({
                    url: baseURL+postUrl,
                    data: settings,
                    resumeChunkSize: '5MB',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    alert('Question created succesfully!');
                    cleanQuestionForm();
                }, function (response) {
                    $scope.progressbar.complete();
                    alert("Problem in adding questions!");
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
            $scope.createMCQQuestionForm = {content:"",explanation:"", level:"easy", answer_order:"random", sub_category:"", que_type:"mcq", ideal_time:""};
            $scope.insertBlank = function(){
                $scope.createMCQQuestionForm.content += " <<Answer>> ";
            }
            $scope.postMCQQuestion = function() {
                console.log($scope.createMCQQuestionForm);
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

            function cleanQuestionForm(){
                $scope.createMCQQuestionForm['explanation'] = '';
                $scope.createMCQQuestionForm['ideal_time'] = '';
                $scope.createMCQQuestionForm['content'] = '';
                $scope.createMCQQuestionForm['optioncontent'] = {};
                $scope.createMCQQuestionForm['correctoption'] = '';
                $scope.figure = undefined;
                $scope.isImageChanged = false;
            }
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
            }else{
                $scope.upload("question/"+que_type+"/bulkupload/", {}, file);                   
            }
        };

        function cleanQuestionForm(){
            $scope.createObjectiveQuestionForm['explanation'] = '';
            $scope.createObjectiveQuestionForm['ideal_time'] = '';
            $scope.createObjectiveQuestionForm['content'] = '';
            $scope.createObjectiveQuestionForm['correct'] = '';
            $scope.figure = undefined;
            $scope.isImageChanged = false;
        }

    }])

    .controller('UpdateQuestionController', ['$scope', '$controller', '$state', '$stateParams', 'QuestionsFactory', 'Upload', 'ngProgressFactory', function($scope, $controller, $state, $stateParams, QuestionsFactory, Upload, ngProgressFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.que_type = $stateParams.questionParams.split(':')[1];
        QuestionsFactory.getQuestion($scope.user, $stateParams.questionParams.split(':')[0]).get()
            .$promise.then(
                function(response){
                    $scope.question = response.question;
                    $scope.baseURLImage = baseURLImage;
                    $scope.updateQuestionForm = {figure:response.figure, content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation, que_type : $scope.question.que_type, ideal_time: $scope.question.ideal_time };
                    if($scope.que_type==='objective')
                        $scope.updateQuestionForm.content = $scope.question.content.replace(/<>/g,'<<Answer>>');
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

        $scope.putQuestion = function() {
            upload("quiz/question/"+$scope.user+"/"+$stateParams.questionParams.split(':')[0]+"/", $scope.updateQuestionForm);
        }

        function upload(postUrl, data){
            $scope.progressbar.start();
            $scope.progressbar.setHeight('6px');
            $scope.progressbar.setColor('red');
            Upload.upload({
                    url: baseURL+postUrl,
                    data: { data: data },
                    resumeChunkSize: '5MB',
                    method: 'PUT',
                }).then(function(response) {
                    $scope.progressbar.complete();
                    $scope.isImageChanged = false;
                    $scope.question.figure = response.data.figure;
                    $scope.updateQuestionForm = {figure: undefined, heading: response.data.heading, content : response.data.content, level : response.data.level, explanation : response.data.explanation, ideal_time: response.data.ideal_time };
                    alert('Question updated succesfully!');
                }, function (response) {
                    $scope.progressbar.complete(); 
                    $scope.errors = response.data;
                }, function(event) {
                    $scope.progressbar.set(parseInt(100.0*event.loaded/event.total));
                });
        }
    }])


    .controller('UpdateAnswersController', ['$scope', '$controller', '$state', '$stateParams', 'QuestionsFactory', function($scope, $controller, $state, $stateParams, QuestionsFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.que_type = $stateParams.questionParams.split(':')[1];

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
                $scope.updateAnswersForm = { correct: $scope.answers.correct, content: $scope.answers.content, sub_category: $scope.answers.sub_category };
            }
        }

        QuestionsFactory.getAnswers($scope.user, $stateParams.questionParams.split(':')[0], $stateParams.questionParams.split(':')[1]).get()
            .$promise.then(
                function(response){
                    $scope.answers = response.answers;
                    modifyTheResult();
                    // $scope.updateQuestionForm = {content : $scope.question.content, level : $scope.question.level, explanation : $scope.question.explanation };
                },
                function(response) {
                    $scope.unableToGetAnswers = response.data.errors;
                }
            );
        $scope.putAnswers = function() {
            QuestionsFactory.updateAnswers($scope.user, $stateParams.questionParams.split(':')[0], $stateParams.questionParams.split(':')[1]).update($scope.updateAnswersForm).$promise.then(
                function(response){
                    $scope.answers = response;
                    modifyTheResult();
                    alert('Answer updated succesfully!');
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to update the answers. See below errors.";
                    $scope.errors = response.data.errors;
                });
            setTimeout(closeAlert, 5000);
        }
    }]);