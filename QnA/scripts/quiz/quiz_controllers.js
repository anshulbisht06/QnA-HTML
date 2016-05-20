/* global $ */

appmodule
	.controller('QuizController', ['$scope','$http', '$controller', '$state', 'QuestionsFactory','QuizFactory', 'CategoryFactory','Upload', function($scope, $http, $controller, $state, QuestionsFactory, QuizFactory, CategoryFactory, Upload) {
	        // pagination
	        $scope.curPage = 0;
	        $scope.pageSize = 9;
	        $scope.testURL = testURL;
	        $controller('CookiesController', {$scope : $scope});
	        QuizFactory.getAllQuiz($scope.user, "all").query(
            function(response){
                $scope.allQuiz = response;
            },
            function(response){
                $scope.unableToGetAllQuiz = true;
                $scope.errors = "Unable to get your quizzes.";
            });
	        $scope.numberOfPages = function(){
	            if($scope.allQuiz){
	                return Math.ceil($scope.allQuiz.length / $scope.pageSize);
	            }
	        };

	        $scope.createQuizForm = {title:"", no_of_attempt:"1", passing_percent:"",
	        	user:$scope.user, success_text:"", fail_text:"",user_picturing:false, start_notification_url:"", finish_notification_url:"", grade_notification_url:""};
	        
	        $scope.postQuiz = function() {
	            $scope.createQuizForm.user = $scope.user;
	            QuizFactory.createQuiz().save($scope.createQuizForm).$promise.then(
	                function(response){
	                    $scope.createQuizForm = {title:"", no_of_attempt:"1", passing_percent:"",
	        				user:$scope.user, success_text:"", fail_text:"",user_picturing:false, start_notification_url:"", finish_notification_url:"", grade_notification_url:""};
	        				angular.element(document.querySelector('#quizCreateModal')).modal('hide');
	                    $scope.allQuiz.push(response);
                    	showAlert('alert-success', "Quiz "+response.title+" has been created.");
	                },
	                function(response) {
	                    if(response.data.hasOwnProperty('non_field_errors')){
	                    	$scope.errors = { 'title' : ['This title is used by some other user. Select some other title.'] };
	                    }else{
	                    	$scope.errors = response.data;
	                    }
	                });
	        }

	        function upload(postUrl, quiz_id, file_data){
	            Upload.upload({
	                    url: baseURL+postUrl,
	                    data: { file_data:file_data,quiz_id: quiz_id },
	                    // headers: {'Authorization': 'JWT ' + $cookies.get('token')},
	                    resumeChunkSize: '5MB',
	                }).then(function(response) {
	                	angular.element(document.querySelector('#quizAccessModal')).modal('hide');
	                    alert('Access set succesfully!');
	                    $('#uploadAccessXLS').val('');
	                }, function (response) {
	                    alert(response.data.errors);
	                    $('#uploadAccessXLS').val('');
	                }, function(event) {	
	                });
        	}

	        $scope.markPublic = function (quizId) {
	        	QuizFactory.setQuizPublic($scope.user, quizId).update({}).$promise.then(
	                function(response){
	                    var mark = '';
	                    if(response.allow_public_access){
	                    	mark = 'public';
	                    }
	                    else{
	                    	mark = 'private';
	                    }
	                    var index = findIndexOfObjectInsideList($scope.allQuiz, response.id);
	                    $scope.allQuiz[index].allow_public_access = response.allow_public_access;
                    	showAlert('alert-success', "Your test "+response.title+" has been marked as "+mark+".");
	                },
	                function(response){
	                    $scope.errors = response.data;
	                });
	        }


	        $scope.deleteQuiz = function(action, quizId, quizTitle){
	        	if(action==='deleteQuizRequestInitiated'){
	        		$scope.quizToBeDeletedID = quizId;
	        		$scope.quizToBeDeletedTitle = quizTitle;
	        		angular.element(document.querySelector('#quizDeleteModal')).modal('show');
	        	}
	        	else if(action==='deleteQuizRequestAccepted'){
	        		QuizFactory.deleteQuiz($scope.user, quizId).delete().$promise.then(
		                function(response){
		                	var index = findIndexOfObjectInsideList($scope.allQuiz, $scope.quizToBeDeletedID);
		                	$scope.allQuiz.splice(index, 1);
		                    $scope.quizToBeDeletedID = null;
			        		$scope.quizToBeDeletedTitle = null;
			        		showAlert('alert-success', "Your quiz named "+$scope.quizToBeDeletedTitle.toUpperCase()+" has been deleted.");
			        		angular.element(document.querySelector('#quizDeleteModal')).modal('hide');
		                },
		                function(response) {
		                	angular.element(document.querySelector('#quizDeleteModal')).modal('hide');
                    		showAlert('alert-danger', "Unable to delete the quiz.");
		                    alert(response.data.errors);
		                });
	        	}
	        	else if(action==='deleteQuizRequestCancelled'){
	        		$scope.quizToBeDeletedID = null;
	        		$scope.quizToBeDeletedTitle = null;
	        		angular.element(document.querySelector('#quizDeleteModal')).modal('hide');
	        	}else{
	        		$scope.quizToBeDeletedID = null;
	        		$scope.quizToBeDeletedTitle = null;
	        		angular.element(document.querySelector('#quizDeleteModal')).modal('hide');
	        	}

	        }

	        $scope.putQuiz = function(action, quiz){
	        	if(action==='updateQuizRequestInitiated'){
	        		$scope.quizToBeUpdated = quiz;
	        		$scope.updateQuizForm = { title:quiz.title, user: $scope.user, show_result_on_completion: quiz.show_result_on_completion,
	        			success_text:quiz.success_text, fail_text:quiz.fail_text, passing_percent:quiz.passing_percent,  allow_public_access:quiz.allow_public_access,
	        			no_of_attempt:quiz.no_of_attempt.toString(), user_picturing:quiz.user_picturing, start_notification_url:quiz.start_notification_url,
	        			finish_notification_url:quiz.finish_notification_url, grade_notification_url:quiz.grade_notification_url };
	        		angular.element(document.querySelector('#quizUpdateModal')).modal('show');
	        	}
	        	else if(action==='updateQuizRequestAccepted'){
	        		QuizFactory.updateQuiz($scope.user, quiz.id).update($scope.updateQuizForm).$promise.then(
	                function(response){
	                	var index = findIndexOfObjectInsideList($scope.allQuiz, $scope.quizToBeUpdated.id);
	                	$scope.allQuiz[index] = response.updatedQuiz;
	                    showAlert('alert-success', "Your quiz named "+$scope.quizToBeUpdated.title.toUpperCase()+" has been updated.");
	                    angular.element(document.querySelector('#quizUpdateModal')).modal('hide');
	        			$scope.quizToBeUpdated = null;
	                },
	                function(response) {
	                    if(response.data.hasOwnProperty('non_field_errors')){
	                    	$scope.errors = { 'title' : ['This title is used by some other user. Select some other title.'] };
	                    }else{
	                    	$scope.errors = response.data;
	                    }
	                }); 
	        	}
	        	else if(action==='updateQuizRequestCancelled'){
	        		angular.element(document.querySelector('#quizUpdateModal')).modal('hide');
	        		$scope.quizToBeUpdated = null;
	        	}else{
	        		angular.element(document.querySelector('#quizUpdateModal')).modal('hide');
	        		$scope.quizToBeUpdated = null;
	        	}
	        }

	        $scope.quizAccessUsernameMail = function(action, quiz){
	        	if(action==='updateQuizAccessToPrivateInitiated'){
	        		$scope.quizToBeUpdated = quiz;
	        		angular.element(document.querySelector('#quizAccessModal')).modal('show');
	        	}
	        	else if(action==='updateQuizAccessToPrivateInitiatedCancelled'){
	        		$scope.quizToBeUpdated = null;
	        		$('#uploadAccessXLS').val('');
	        	}
	        }

	        $scope.downloadTestAccessXls = function(test_id){
	            $http.post(baseURL+"quiz/access/download/xls/", {test_id:test_id}, { responseType: 'arraybuffer' })
	              .success(function(data) {
	                var file = new Blob([data], { type: 'application/xls' });
	                saveAs(file, $scope.quizToBeUpdated.title+'_access.xls');
	            });
        	}

        	$scope.uploadAccessXLSFile = function(quiz_id){
	            var file = $scope.uploadAccessXLS;
		        if(file===undefined || $('#uploadAccessXLS').val()===""){
		            $scope.noFileUploaded = true;
		        } else{
		        	$scope.noFileUploaded = false;
		           	upload("quiz/access/upload/xls/", quiz_id, file);                   
		        }
            };


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
	    }]);