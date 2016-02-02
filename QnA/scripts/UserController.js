// angular.module('UserM')   
//     .controller("UserController",function ($scope, $http, $window) {
//         $scope.username = getCookie('username');
//         $scope.email = getCookie('email');
//         $scope.username = getCookie('username');
//         // $scope.postLogin = function () {
//         //    // use $.param jQuery function to serialize data from JSON 
//         //     var data = $.param({
//         //         username: $scope.username,
//         //         password: $scope.password
//         //     });
//         //     // $window.localStorage.token
//         //     var config = {
//         //         headers : {
//         //             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         //         }
//         //     }

//         //     $http.post('http://localhost:8000/login/', data, config)
//         //     .success(function (data, status, headers, config) {
//         //         $scope.postDataResponse = data;

//         //         setCookie('token',data.token);
//         //         setCookie('username',data.username);
//         //         setCookie('email',data.email);
//         //         $scope.isFormInvalid = false;
//         //         $scope.alertType = "success";
//         //         $scope.alertMsg = "Successfully login.";
//         //         $window.location.href = '/index.html'
//         //     })
//         //     .error(function (data, status, header, config) {
//         //         $scope.isFormInvalid = true;
//         //         $scope.alertType = "danger";
//         //         $scope.alertMsg = "Unable to login.";
//         //         $scope.errors = response.data;
//         //     });
//         // };
//     })