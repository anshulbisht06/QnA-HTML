/* global $ */


appmodule.run(function($rootScope,$timeout,ngProgressFactory){
    $rootScope
    .$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){ 
            $rootScope.progressbar = ngProgressFactory.createInstance();
            $rootScope.progressbar.start();
            $rootScope.progressbar.setHeight('6px');
            $rootScope.progressbar.setColor('#ffc34d');
    });

    $rootScope
    .$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            $timeout($rootScope.progressbar.complete(), 1000); 
    });
    // $rootScope.$on('$viewContentLoading', 
    //     function(event, viewConfig){ 
    // });
});

appmodule
    .controller('CookiesController', ['$scope', '$rootScope', '$cookies', '$state', function($scope, $rootScope, $cookies, $state) {
        try{
            $rootScope.user = $cookies.get('user');
            $rootScope.username = $cookies.get('username');
            $rootScope.token = $cookies.get('token');
            if($rootScope.token === undefined){    
                $state.go('app.login-user');
            }
        }catch(err){}
    }])

    .controller('IndexController', ['$scope', '$rootScope', '$controller', function($scope, $rootScope, $controller) {
        $controller('CookiesController', {$scope : $scope});
        
    }])

    .controller('LogoutController', ['$scope', '$http', '$state','$cookies', function($scope, $http, $state, $cookies) {
        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                }
            }
        var data = {};
        $scope.postLogout = function logout() {
            $cookies.remove('token');
            $cookies.remove('username');
            $cookies.remove('user');  
          return $http.post(baseURL+'logout/', data, config)
            .success(function(data, status, headers, config) {
                // $cookies.remove('token');
                // $cookies.remove('username');
                // $cookies.remove('user');
                $state.go('app.login-user');
          })
            .error(function logoutErrorFn(data, status, headers, config) {

          })
        }
    }])

    .controller('UserRegisterController', ['$scope','$state', 'UserRegisterFactory', function($scope, $state , UserRegisterFactory) {
        $scope.registerUserForm = {username:"",email:"",password:"",first_name:""};
        $scope.postRegister = function() { 
            UserRegisterFactory.createUser().save($scope.registerUserForm).$promise.then(
                function(response){
                    $scope.isFormInvalid = false;
                    $scope.userRegisterForm.$setPristine();
                    $scope.alertType = "success";
                    $scope.alertMsg = "You are successfully registered. Please login.";
                    $state.go('app.login-user');
                },
                function(response) {
                    $scope.alertType = "danger";
                    $scope.alertMsg = "Unable to register. See below errors.";
                    $scope.isFormInvalid = true;
                    $scope.errors = response.data;
                });
                setTimeout(closeAlert, 5000);

        }
    }])     


    .controller("LoginController",[ '$scope', '$rootScope', '$http', '$state', '$cookies', function ($scope, $rootScope, $http, $state, $cookies) {
        if($cookies.get('token')){
            $state.go('app.home');
        }else{
            $rootScope.user = undefined;
            $rootScope.username = undefined;
            $rootScope.token = undefined;

            $scope.postLogin = function () {
                $('#loader').css('display','block');

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
                    setTimeout(closeAlert, 5000);
                });
            };
        }
    }]);
        

    

