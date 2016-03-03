/* global $ */

appmodule
	.controller('CreateCategoryController', ['$scope','$state', '$controller', '$cookies', 'CategoryFactory', 'QuizFactory','$stateParams', function($scope, $state, $controller, $cookies, CategoryFactory, QuizFactory, $stateParams) {
        $controller('CookiesController', {$scope : $scope});
        if($scope.user){
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
            CategoryFactory.createCategory().save($scope.createCategoryform).$promise.then(
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
    }]);
