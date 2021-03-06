/* global $ */
appmodule
	.controller('CreateSubCategoryController', ['$scope','$state', '$controller', 'CategoryFactory', 'SubCategoryFactory','$stateParams', function($scope, $state, $controller, CategoryFactory, SubCategoryFactory, $stateParams) {
        $controller('CookiesController', {$scope : $scope});

        CategoryFactory.getAllCategories($scope._rest, "all").query(
        function(response){
            $scope.allCategories = response;
        },
        function(response){
            $scope.unableToGetAllCategories = true;
            $scope.errors = "Unable to get your categories.";
        });

        
        SubCategoryFactory.getAllSubcategories($scope._rest, "all").query(
        function(response){
            $scope.allSubCategories = response;
        },
        function(response){
            $scope.unableToGetAllSubCategories = true;
            $scope.errors = "Unable to get your SubCategories.";
        });
        
        $scope.categoryid = $stateParams.obj ? $stateParams.obj.categoryid.toString() : "";
        
        $scope.createSubCategoryform = { sub_category_name : "", category : "", user : $scope._rest };
        
        if($scope.categoryid){
            $scope.alertType = "info";
            $scope.alertMsg = "Please select or create a sub-category first";
            $scope.createSubCategoryform.category = $scope.categoryid;
        }
        
        $scope.postSubCategory = function() {
            var response = SubCategoryFactory.createSubCategory().save($scope.createSubCategoryform).$promise.then(
                function(response){
                    $scope.createSubCategoryform.sub_category_name = '';
                    $state.go('app.questions');
                    showAlert('alert-success', "Your sub-category named " + $scope.createSubCategoryform.sub_category_name + " has been created.");
                },
                function(response) {
                    showAlert('alert-danger', "Unable to create the sub-category for " + $scope.createSubCategoryform.sub_category_name + ". See below error.");
                    $scope.errors = response.data;
                });
            angular.element(document.querySelector('#createSubCategoryModal')).modal('hide');
        }
    }]);
