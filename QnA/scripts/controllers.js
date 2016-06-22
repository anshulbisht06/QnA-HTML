/* global $ */

// This run() is called on every refresh.
appmodule.run(function($rootScope, ngProgressFactory, $cookies, $templateCache){
    $rootScope
    .$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){ 
            $rootScope.progressbar = ngProgressFactory.createInstance();
            $rootScope.changeProgressBar('6px', '#ffc34d');
    });

    $rootScope.changeProgressBar = function(height, color){
        $rootScope.progressbar.start();
        $rootScope.progressbar.setHeight(height);
        $rootScope.progressbar.setColor(color);
    }

    $rootScope
    .$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            $rootScope.progressbar.complete(); 
    });
    // $rootScope.$on('$viewContentLoading', 
    //     function(event, viewConfig){ 
    // });
    $templateCache.put('views/alert_msg.html', '<div class="alert text-center bold-text" id="notification" style="display: none;"><p id="alertMsg"></strong></div>');
});

appmodule
    .controller('CookiesController', ['$scope', '$rootScope', '$cookies', '$state', function($scope, $rootScope, $cookies, $state) {
        try{
            $rootScope._rest = $cookies.get('_rest');
            $rootScope.username = $cookies.get('username');
            $rootScope.token = $cookies.get('token');
            if($rootScope.token === undefined || $rootScope._rest === undefined || $rootScope.username === undefined){
                $cookies.remove('token');
                $cookies.remove('username');
                $cookies.remove('_rest'); 
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
          return $http.post(baseURL+'logout/', data, config)
            .success(function(data, status, headers, config) {
                $cookies.remove('token');
                $cookies.remove('username');
                $cookies.remove('_rest');
                $state.go('app.login-user');
          })
            .error(function logoutErrorFn(data, status, headers, config) {
                $cookies.remove('token');
                $cookies.remove('username');
                $cookies.remove('_rest');
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
                    showAlert('alert-success', 'Your are registered successfully.');
                    $state.go('app.login-user');
                },
                function(response) {
                    showAlert('alert-danger', 'Problem in registration. See below errors.'); 
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
                    expireDate.setDate(expireDate.getDate() + 1);
                    if($scope.remember){
                        expireDate.setDate(expireDate.getDate() + 6);
                    }

                    var options={
                        expires: expireDate
                    };

                    $cookies.put('token', data.token, options);
                    $cookies.put('username', data.username, options);
                    $cookies.put('_rest', data._rest, options);

                    $scope.isFormInvalid = false;
                    $state.go('app.all-quiz');
                })
                .error(function (data, status, header, config) {
                    $scope.isFormInvalid = true;
                    showAlert('alert-danger', 'Login error. See below errors.'); 
                    $scope.errors = data.errors? data.errors:'';
                    setTimeout(closeAlert, 5000);
                });
            };
        }
    }]);
        

    

