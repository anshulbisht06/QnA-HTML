/* global $ */
appmodule
    .controller('CookiesController', ['$scope', '$rootScope', '$cookies', '$state', function($scope, $rootScope, $cookies, $state) {
        $rootScope.user = $cookies.get('user');
        $rootScope.username = $cookies.get('username');
        $rootScope.token = $cookies.get('token');
        if($rootScope.token === undefined){    
            $state.go('app.login-user');
        }
    }])

    .controller('IndexController', ['$scope', '$rootScope', '$cookies', '$controller', function($scope, $rootScope, $cookies, $controller) {
        $controller('CookiesController', {$scope : $scope});
    }])

    .controller('LogoutController', ['$scope', '$http', '$state','$cookies', 'baseURL', function($scope, $http, $state, $cookies, baseURL) {
        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Authorization' : 'JWT '+$cookies.get('token')
                }
            }
        var data = {};
        $scope.postLogout = function logout() {
          return $http.post(baseURL+'logout/', data, config)
            .success(function(data, status, headers, config) {
            $cookies.remove('token');
            $cookies.remove('username');
            $cookies.remove('user');
            $state.go('app.login-user');
          })
            .error(function logoutErrorFn(data, status, headers, config) {
          })
        }
    }])

    .controller('UserRegisterController', ['$scope', 'UserRegisterFactory', function($scope, UserRegisterFactory) {
        $scope.registerUserForm = {username:"",email:"",password:"",first_name:""};
        $scope.postRegister = function() { 
            UserRegisterFactory.createUser().save($scope.registerUserForm).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.userRegisterForm.$setPristine();
                    $scope.alertType = "success";
                    $scope.alertMsg = "You are successfully registered. Please login.";
                },
                function(response) {
                    console.log('error ............ >>>>????')
                    $scope.isFormInvalid = true;
                    console.log('...............',response);
                    $scope.errors = response.data;
                    console.log($scope.errors);
                });
        }
    }])     


    .controller("LoginController",[ '$scope', '$rootScope', '$http', '$state', '$cookies', function ($scope, $rootScope, $http, $state, $cookies) {
        $rootScope.user = undefined;
        $rootScope.username = undefined;
        $rootScope.token = undefined;

        $scope.postLogin = function () {

           // use $.param jQuery function to serialize data from JSON 
            var data = $.param({
                username: $scope.username,
                password: $scope.password
            });
            // $window.localStorage.token
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post(baseURL+'login/', data, config)
            .success(function (data, status, headers, config) {
                $scope.postDataResponse = data;
                var expireDate = new Date();

                if($scope.remember){
                    expireDate.setDate(expireDate.getDate() + 1);
                }

                options={
                    path : '/',
                    secure: true,
                    expires: expireDate

                };

                $cookies.put('token', data.token);
                $cookies.put('username', data.username);
                $cookies.put('user', data.userID);

                $scope.isFormInvalid = false;
                // $scope.alertType = "success";
                // $scope.alertMsg = "Successfully login.";
                // $route.reload();

                $state.go('app.all-quiz');
            })
            .error(function (data, status, header, config) {
                $scope.isFormInvalid = true;
                $scope.alertType = "danger";
                $scope.alertMsg = "Unable to login. See the errors below.";
                $scope.errors = data.errors? data.errors:'';
            });
        };
    }]);
        

    

