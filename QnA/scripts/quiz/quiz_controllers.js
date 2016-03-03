/* global $ */

appmodule
	.controller('CreateQuizController', ['$scope', '$controller', '$state', 'QuestionsFactory','QuizFactory', 'CategoryFactory', function($scope, $controller, $state, QuestionsFactory, QuizFactory, CategoryFactory) {
	        // pagination
	        $scope.curPage = 0;
	        $scope.pageSize = 9;
	        $controller('CookiesController', {$scope : $scope});

	        $scope.createQuizForm = {title:"",description:"",url:"",category:"",random_order:false,answers_at_end:false,single_attempt:false,exam_paper:false,max_questions:"",pass_mark:"",success_text:"",fail_text:""};
	        $scope.postQuiz = function() {
	            $scope.createQuizForm.user = $scope.user;
	            QuizFactory.createQuiz().save($scope.createQuizForm).$promise.then(
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
	            CategoryFactory.getAllCategories($scope.user, parseInt(quizid)).query(
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

	.controller('ViewUpdateQuizController', ['$scope', '$controller', '$state', '$stateParams', 'QuizFactory', function($scope, $controller, $state, $stateParams, QuizFactory) {
	            $controller('CookiesController', {$scope : $scope});
	            QuizFactory.getQuiz($scope.user, $stateParams.quizid).get()
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
	                QuizFactory.updateQuiz($scope.user, $stateParams.quizid).update($scope.quiz).$promise.then(
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