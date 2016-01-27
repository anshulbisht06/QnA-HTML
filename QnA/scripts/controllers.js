/* global $ */
angular.module('QnA')
    .controller('IndexController', ['$scope', 'indexFactory', function($scope, indexFactory) {
        $scope.welcomeHeading = indexFactory.welcomeHeading;
    }])
    .controller('CreateQuizController', ['$scope', 'createQuizFactory', function($scope, createQuizFactory) {
        $scope.createquizmsg = createQuizFactory.createquizmsg;
        $scope.postQuiz = function() { 
            console.log('anshul');               
            var resource = createQuizFactory.createQuiz().save();
            console.log(resource);
            };
    }]);