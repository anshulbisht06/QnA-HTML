/* global $ */

appmodule
	.controller('AddQuizStackController', ['$scope', '$window', '$state', '$controller', '$stateParams', '$compile', 'QuizFactory', 'QuizStackFactory', 'SubCategoryFactory', 'QuestionsFactory', function($scope, $window, $state, $controller, $stateParams, $compile, QuizFactory, QuizStackFactory, SubCategoryFactory, QuestionsFactory) {
            $controller('CookiesController', {$scope : $scope});
            // $scope.go = function(path) {
            //     angular.element(document.querySelector('#sub_cat_not_hv_que')).modal('hide');
            //     angular.element(document.querySelector('body')).removeClass('modal-open');
            //     angular.element(document.querySelector('.modal-backdrop')).remove();
            //     $state.go(path);
            // };
            var total_duration = 0;
            SubCategoryFactory.getAllSubcategories($scope.user, 'all', true).query(
            function(response) {
                $scope.subCategories = response;
            },
            function(response) {
                $scope.errors = response.data;
                $scope.unableToGetAllSubCategories = true;
            });
            QuizFactory.getQuiz($scope.user, $stateParams.quizid).get()
            .$promise.then(
                function(response){
                    $scope.quizName = response['title'];
                    $scope.quizKey = response['quiz_key'];
                },
                function(response) {
                    $scope.unableToGetQuizName = true;
                }
            );
            QuizStackFactory.getQuizStack($stateParams.quizid, 'all').query(
            function(response) {
                $scope.existingStack = response;
                total_duration = 0;
                for(i=0;i<response.length;i++){
                    total_duration += parseInt(response[i].duration);
                    html = '<tr id="oldstackrow'+i+'">'+
                            '<td style="width:130px;">'+response[i].section_name+'</td>'+
                            '<td style="width:200px;">'+$('#subcategory'+response[i].subcategory).text()+'</td>'+
                            '<td style="width:130px;">'+response[i].que_type+'</td>'+
                            '<td style="width:130px;">'+response[i].level+'</td>'+
                            '<td style="width:130px;">'+response[i].no_questions+'</td>'+
                            '<td style="width:130px;">'+response[i].duration+'</td>'+
                            '<td style="width:130px;">'+response[i].istimed+'</td>'+
                            '<td style="width:130px;">'+response[i].correct_grade+'</td>'+
                            '<td style="width:130px;">'+response[i].incorrect_grade+'</td>'+
                            '<td style="width:130px;">'+response[i].question_order+'</td>'+
                            // '<td title="Select your own questions." ui-sref="app.select-questions({quizstackid : '+response[i].id+' })"><span class="glyphicon glyphicon-list-alt selectquestionsbutton"></span></td>'+
                            '<td style="width:60px;"><a href="javascript:void(0);"><span class="glyphicon glyphicon-trash removefromstackbutton" ng-click="removeFromStackAndSave('+response[i].quiz+', '+response[i].id+')" title="Click to delete permanently."></span></a></td>'+
                        +'</tr>';
                    angular.element(document.querySelector('#existingQuestionsRow')).append($compile(html)($scope));
                    $scope.total_duration = total_duration;
                }
                // document.querySelector('#totalduration').value = total_duration;
            },
            function(response) {
                $scope.unableToGetAllSavedStacks= true;
            });            
            $scope.selectedSubCategoryDropdown = "";
            $scope.modelForNoofQuestions = [];
            var selectNoQuestions = function(noOfQuestions, count){
                console.log(noOfQuestions);
                var result = '<select class="form-control" name="no_questions" id="no_questions'+count+'" ng-model="modelForNoofQuestions['+count+']"><option value="" disabled>Select here</option>';
                for(var i=0;i<noOfQuestions;i++){
                    result += '<option value="'+(i+1)+'">'+(i+1)+'</option>';
                }
                return result + '</select>';
            }
            $scope.count = 0;
            $scope.modelForLevels = [];
            $scope.modelForQuestionTypes = [];
            $scope.duration = [];
            var s = {};
            $scope.changeNoQuestions = function(count){
                try{
                    var result = '';
                    var levelInfo = { 'easy' : 0, 'medium' : 1, 'hard' : 2, 'total' : 3 };
                    var levelValue = $scope.modelForLevels[count].split('-')[0];
                    var typeValue = $scope.modelForQuestionTypes[count].split('-')[0];
                    angular.element(document.querySelector('#levelwiseqs'+count)).html($compile(selectNoQuestions(QuizStackFactory.getSelectedLevelQuestions(count)[typeValue][levelInfo[levelValue]], count))($scope));
                }catch(err){
                    alert('First select the type of question');
                }
            }

            $scope.changeLevel = function(count){
                var typeValue = $scope.modelForQuestionTypes[count].split('-');
                var level = [];
                var questions_level_info = QuizStackFactory.getSelectedLevelQuestions(count)[typeValue[0]];
                if(questions_level_info[0]!=0){ level.push('easy'); }
                if(questions_level_info[1]!=0){ level.push('medium'); }
                if(questions_level_info[2]!=0){ level.push('hard'); }
                var levelHtml = '<select class="form-control" name="level" id="level'+count+'" ng-model="modelForLevels['+count+']" ng-change="changeNoQuestions('+count+')"><option value="" disabled>Select here</option>';
                for(var i=0;i<level.length;i++){
                    levelHtml += '<option value="'+level[i]+'-'+i+'">'+level[i]+'</option>';
                }
                levelHtml += '</select>';
                angular.element(document.querySelector('#levels'+count)).html($compile(levelHtml)($scope));

            }

            $scope.selectSubCategory = function(subCategoryId){
                $scope.finalStack = [];
                var questions_level_info = [0, 0, 0, 0];
                var level = [];
                QuestionsFactory.getQuestionUnderSubCategory($scope.user, subCategoryId, true).query(
                    function(response) {
                        for(var key in response[0].questions_type_info){
                            questions_level_info[0] += response[0].questions_type_info[key][0];
                            questions_level_info[1] += response[0].questions_type_info[key][1];
                            questions_level_info[2] += response[0].questions_type_info[key][2];
                            questions_level_info[3] += response[0].questions_type_info[key][3];
                        }
                        if(questions_level_info[3] == 0){
                            angular.element(document.querySelector('#sub_cat_not_hv_que')).modal("show");
                            return false;   
                        }else{
                            QuizStackFactory.addSelectedLevelQuestions(response[0].questions_type_info);
                        }

                        $scope.selectedSubCategory = response[0];
                        s[$scope.count] = {
                                'quiz' : $stateParams.quizid,
                                'subcategory' : $scope.selectedSubCategory['subcategory_id'],
                                'section_name' : $scope.selectedSubCategory['section_name'],
                                'que_type' : $scope.selectSubCategory['que_type'],
                                'level' : $scope.selectSubCategory['level'],
                                'no_questions' : $scope.selectSubCategory['no_questions'],
                                'duration' : $scope.selectSubCategory['duration'],
                                'istimed' : $scope.selectSubCategory['istimed'],
                                'correct_grade' : $scope.selectSubCategory['correct_grade'],
                                'incorrect_grade' : $scope.selectSubCategory['incorrect_grade'],
                                'question_order' : $scope.selectSubCategory['question_order'],
                            }

                        QuizStackFactory.addToFinalStack(s);

                        queTypesHtml = '<select class="form-control" name="que_type" id="que_type'+$scope.count+'" ng-model="modelForQuestionTypes['+$scope.count+']" ng-change="changeLevel('+$scope.count+')"><option value="" disabled>Select here</option>';
                        for(var i=0;i<$scope.selectedSubCategory['que_type'].length;i++){
                            queTypesHtml += '<option value="'+$scope.selectedSubCategory['que_type'][i]+'-'+i+'">'+$scope.selectedSubCategory['que_type'][i]+'</option>';
                        }
                        queTypesHtml += '</select>';

                        html = '<tr id="newstackrow'+$scope.count+'">'+
                                    '<td style="width:130px;"><input type="number" min="1" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="section_name"  id="section_name'+$scope.count+'" value="'+$scope.selectedSubCategory['section_name']+'" readonly></td>'+
                                    '<td style="width:200px;">'+$scope.selectedSubCategory['subcategory']+'</td>'+
                                    '<td style="width:130px;">'+queTypesHtml+'</td>'+
                                    '<td style="width:130px;" id="levels'+$scope.count+'"></td>'+
                                    '<td style="width:130px;" id="levelwiseqs'+$scope.count+'"></td>'+
                                    '<td style="width:130px;"><input type="number" min="1" max="180" class="form-control" id="duration'+$scope.count+'" ondblclick="makeEditable(this)" onblur="makeUneditable(this); name="duration" value="'+$scope.selectedSubCategory['duration']+'" readonly></td>'+
                                    '<td style="width:130px;"><select class="form-control" name="istimed" id="istimed'+$scope.count+'"><option value="yes">yes</option><option value="no">no</option></select></td>'+
                                    '<td style="width:130px;"><input type="number" min="1" max="100" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="correct_grade" id="correct_grade'+$scope.count+'" value="'+$scope.selectedSubCategory['correct_grade']+'" readonly></td>'+
                                    '<td style="width:130px;"><input type="number" min="-100" max="100" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="incorrect_grade" id="incorrect_grade'+$scope.count+'" value="'+$scope.selectedSubCategory['incorrect_grade']+'" readonly></td>'+
                                    '<td style="width:130px;"><select class="form-control" name="question_order" id="question_order'+$scope.count+'"><option value="random">random</option><option value="content">content</option></select></td>'+
                                    '<td style="width:60px;"><a href="javascript:void(0);"><span class="glyphicon glyphicon-remove-circle removefromstackbutton" ng-click="removeFromStack('+$scope.count+')" title="Click to remove it."></span></a></td>'+
                                    '<td style="width:60px;"><a href="javascript:void(0);"><span class="glyphicon glyphicon-ok-circle addtostackbutton" ng-click="addToStackAndSave('+$scope.count+')" title="Click to save it."></span></a></td>'+
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
                try{
                    r = QuizStackFactory.getValueFromStack(count);
                    r[count]['level'] = document.querySelector("#level"+count).value.split('-')[0];
                    r[count]['que_type'] = document.querySelector("#que_type"+count).value.split('-')[0];
                    r[count]['no_questions']  = document.querySelector("#levelwiseqs"+count+" select").value;
                    r[count]['duration']  = document.querySelector("#duration"+count).value;
                    if(r[count]['que_type']==="" || r[count]['level']==="" || r[count]['no_questions']==="" || r[count]['duration']<=0){
                        alert('Fill all fields correctly!');
                        return;
                    }
                    r[count]['section_name'] = 'Section#'+document.querySelector("#section_name"+count).value;
                    if(document.querySelector("#istimed"+count).value==='yes')
                        r[count]['istimed'] = true;
                    else
                        r[count]['istimed'] = false;
                    r[count]['correct_grade'] = document.querySelector("#correct_grade"+count).value;
                    r[count]['incorrect_grade'] = document.querySelector("#incorrect_grade"+count).value;
                    r[count]['question_order'] = document.querySelector("#question_order"+count).value;
                    QuizStackFactory.updateFinalStack(count, r[count]);

                    QuizStackFactory.addToQuizStack().save(QuizStackFactory.getValueFromStack(count)[count]).$promise.then(
                    function(response){
                        window.location.reload();
                    },
                    function(response) {
                        alert(response.data.errors);
                    });
                }catch(err){
                    alert('Fill all fields correctly!');
                    return;
                }
            }
            $scope.removeFromStack = function(count){
                QuizStackFactory.removeFromStack(count);
                document.querySelector("#newstackrow"+count).style.display = "none";
            }
            $scope.removeFromStackAndSave = function(quizid, quizstackid){
                QuizStackFactory.deleteFromStack(quizid, quizstackid).delete().$promise.then(
                function(response){
                    window.location.reload();                   
                },
                function(response) {
                    alert(response.data.errors);
                });
            }
            
            // $scope.getUserDetails = function(){
            //     // console.log($scope.quizName)
            //     $window.data = { 'quiz': $stateParams.quizid , 'quizName': $scope.quizName, 'quizStacks' : $scope.existingStack, 'details' : {} };
            //     $window.open($state.href('app.test-login', {parameter: "parameter"}), "Test Window", "width=1280,height=890,resizable=0");
            // }
            $scope.openTestWindow = function(){
                data = { 'quiz': $stateParams.quizid , 'quizName': $scope.quizName, 'quizStacks' : $scope.existingStack, 'details' : {} };    
                l = [];
                for(var i=0;i<$scope.existingStack.length;i++){
                    if(l.indexOf($scope.existingStack[i].section_name)==-1){
                        data['details'][$scope.existingStack[i].section_name] = { 'duration': 0, 'questions' : 0};
                        l.push($scope.existingStack[i].section_name);
                    }
                    data['details'][$scope.existingStack[i].section_name]['duration'] += parseInt($scope.existingStack[i].duration);
                    data['details'][$scope.existingStack[i].section_name]['questions'] += parseInt($scope.existingStack[i].no_questions);
                }
                $window.data = data;
                $window.open($state.href('app.test-preview', {parameter: data}), "Test Window", "width=1280,height=890,resizable=0");
            }
        }])
    .controller('SelectQuestionsController', ['$scope', '$state', '$controller', '$stateParams', 'QuizStackFactory', function($scope, $state, $controller, $stateParams, QuizStackFactory) {
        $controller('CookiesController', {$scope : $scope});
        $scope.curPage = 0;
        $scope.pageSize = 10;
        QuizStackFactory.getQuizStackSelectedQuestions($stateParams.quizstackid).get()
            .$promise.then(
                function(response){
                    $scope.quizStack = response;
                    $scope.selectedQuestions = [];
                    $scope.limit = Math.ceil(response.questions.length/$scope.pageSize);
                    for(var i=0;i<response.questions.length;i++){
                        if(response.questions[i].is_selected)
                            $scope.selectedQuestions.push(response.questions[i].id);
                    }
                },
                function(response) {
                    alert(response.data.errors);
        });
        $scope.selectQuestion = function(selectedQuestionId){
            var index = $scope.selectedQuestions.indexOf(selectedQuestionId);
            if(index === -1){
                $scope.selectedQuestions.push(selectedQuestionId); 
                // $('#checkBox'+selectedQuestionId).prop('checked', true);
                $scope.quizStack.questions[$scope.selectedQuestions.indexOf(selectedQuestionId)].is_selected = true;
            }else{
                $scope.quizStack.questions[index].is_selected = false;
                // $('#checkBox'+selectedQuestionId).prop('checked', false);
                $scope.selectedQuestions.splice(index,1);
            }
        }

        $scope.saveSelectedQuestions = function(){
            QuizStackFactory.postSelectedQuestions($stateParams.quizstackid).save($scope.selectedQuestions).$promise.then(
                function(response){
                    alert('Selected Questions are added successfully!');
                    $state.go('app.view-quiz', {quizid: response.quizId})
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to save the selected questions.";
                    alert(response.data.errors);
                });
        }

    }]);