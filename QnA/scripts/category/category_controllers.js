/* global $ */

appmodule
	.controller('CreateCategoryController', ['$scope','$state', '$controller', 'CategoryFactory', 'QuizFactory','$stateParams', function($scope, $state, $controller, CategoryFactory, QuizFactory, $stateParams) {
        $controller('CookiesController', {$scope : $scope});
        QuizFactory.getAllQuiz($scope._rest, "all").query(
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
        $scope._id = $stateParams.obj ? $stateParams.obj.id.toString() : "";
        if($scope._id){
            $scope.isFormInvalid = true;
            $scope.isCategoryCreated = false;
            showAlert('alert-info', 'Please select or create a category first.');
            $scope.createCategoryform = {category_name : "","user":$scope._rest, quiz : $scope._id};
        }else{
            $scope.createCategoryform = {category_name : "","user":$scope._rest};
        }

        $scope.postCategory_ = function() { 
            CategoryFactory.createCategory().save($scope.createCategoryform).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.isCategoryCreated = true;
                    showAlert('alert-success', "Your category named " + $scope.createCategoryform.category + " has been created. Now please create a sub-category of it.");
                    $scope.createCategoryform = {category_name:""};
                    $state.go('app.questions', {obj:{'categoryid':response.id, 'categoryname':response.category}});                     
                },
                function(response) {
                    $scope.isFormInvalid = true;
                    $scope.isCategoryCreated = false;
                    showAlert('alert-danger', "Unable to create the category - " + $scope.createCategoryform.category + ". See below error."); 
                    $scope.errors = response.data;
                    $scope.createCategoryform = {category_name : "", quiz : [$scope._id]};
                });
        }
    }]);
