/* global $ */

appmodule
	.controller('AddQuizStackController', ['$scope', '$window', '$state', '$controller', '$stateParams', '$compile', 'QuizFactory', 'QuizStackFactory', 'SubCategoryFactory', 'QuestionsFactory', function($scope, $window, $state, $controller, $stateParams, $compile, QuizFactory, QuizStackFactory, SubCategoryFactory, QuestionsFactory) {
            $controller('CookiesController', {$scope : $scope});
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
                        '<td style="width:130px;">'+response[i].level+'</td>'+
                        '<td style="width:130px;">'+response[i].que_type+'</td>'+
                        '<td style="width:130px;">'+response[i].no_questions+'</td>'+
                        '<td style="width:130px;">'+response[i].duration+'</td>'+
                        '<td style="width:130px;">'+response[i].istimed+'</td>'+
                        '<td style="width:130px;">'+response[i].correct_grade+'</td>'+
                        '<td style="width:130px;">'+response[i].incorrect_grade+'</td>'+
                        '<td style="width:130px;">'+response[i].question_order+'</td>'+
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
                QuestionsFactory.getQuestionUnderSubCategory($scope.user, subCategoryId, true).query(
                    function(response) {
                        $scope.selectedSubCategory = response[0];
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
                                    '<td style="width:130px;"><input type="number" min="1" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="section_name"  id="section_name'+$scope.count+'" value="'+$scope.selectedSubCategory['section_name']+'" readonly></td>'+
                                    '<td style="width:200px;">'+$scope.selectedSubCategory['subcategory']+'</td>'+
                                    '<td style="width:130px;">'+levelHtml+'</td>'+
                                    '<td style="width:130px;"><select class="form-control" id="que_type'+$scope.count+'" name="que_type"><option value="mcq">mcq</option><option value="objective">objective</option></select></td>'+
                                    '<td style="width:130px;" id="levelwiseqs'+$scope.count+'">'+selectNoQuestions($scope.selectedSubCategory['questions_level_info'][initialnoOfQuestionIndex])+'</td>'+
                                    '<td style="width:130px;"><input type="number" min="1" max="180" class="form-control" id="duration'+$scope.count+'" ondblclick="makeEditable(this)" onblur="makeUneditable(this); name="duration" value="'+$scope.selectedSubCategory['duration']+'" readonly></td>'+
                                    '<td style="width:130px;"><select class="form-control" name="istimed" id="istimed'+$scope.count+'"><option value="yes">yes</option><option value="no">no</option></select></td>'+
                                    '<td style="width:130px;"><input type="number" min="1" max="100" class="form-control" ondblclick="makeEditable(this)" onblur="makeUneditable(this)" name="correct_grade" id="correct_grade'+$scope.count+'" value="'+$scope.selectedSubCategory['correct_grade']+'" readonly></td>'+
                                    '<td style="width:130px;"><input type="number" min="-100" max="100" class="form-control" ondblclick="makeEditable(this)"onblur="makeUneditable(this)" name="incorrect_grade" id="incorrect_grade'+$scope.count+'" value="'+$scope.selectedSubCategory['incorrect_grade']+'" readonly></td>'+
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
                r = QuizStackFactory.getValueFromStack(count);
                r[count]['level'] = document.querySelector("#level"+count).value.split('-')[0];
                if(r[count]['level']===""){
                    alert('Fill all fields correctly!');
                    return;
                }
                r[count]['que_type'] = document.querySelector("#que_type"+count).value;
                r[count]['section_name'] = 'Section#'+document.querySelector("#section_name"+count).value;
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

                QuizStackFactory.addToQuizStack().save(QuizStackFactory.getValueFromStack(count)[count]).$promise.then(
                function(response){
                    window.location.reload();
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
            $scope.removeFromStackAndSave = function(quizid, quizstackid){
                QuizStackFactory.deleteFromStack(quizid, quizstackid).delete().$promise.then(
                function(response){
                    window.location.reload();                   
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to delete the quiz stack. See below errors.";
                    alert(response.data.errors);
                });
            }
            $scope.go = function(){
                console.log(QuizStackFactory.showStack());
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
                $window.open($state.href('app.test-login', {parameter: "parameter"}), "Test Window", "width=1280,height=890,resizable=0");
            }
        }]);