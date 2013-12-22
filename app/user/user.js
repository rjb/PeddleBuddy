automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/user-login', {
        controller:'UserController',
        templateUrl:'app/user/user-login.html'
    }).when('/user-reset-password', {
        controller:'UserController',
        templateUrl:'app/user/user-reset-password.html'
    }).when('/user-signup-1', {
        controller:'UserController',
        templateUrl:'app/user/user-signup-1.html'
    }).when('/user-signup-2', {
        controller:'UserController',
        templateUrl:'app/user/user-signup-2.html'
    });
}])

automizeApp.controller('UserController', function($scope, $location, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
    $scope.credentials = { username: "", password: "" };
                       
    $scope.signUp = function() {
        Spinner.start();
        if($scope.signupForm.firstName.$invalid || $scope.signupForm.lastName.$invalid) {
            navigator.notification.alert(Parse.nameInvalid.message, function() {}, Parse.nameInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.signupForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.signupForm.password.$invalid) {
            navigator.notification.alert(Parse.passwordInvalid.message, function() {}, Parse.passwordInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.signUp($scope.newUser, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.go('/user-signup-2','slide');
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    $scope.signUpStepTwo = function() {
        Spinner.start();
        if($scope.addressForm.$invalid) {
            Spinner.stop();
            navigator.notification.alert("Please enter a complete and valid address", function() {}, Parse.addressInvalid.title, "OK");
        } else {
            Parse.signUpStepTwo($scope.userDetail, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.go('/', 'slide');
                }, function(error) {
                    $scope.$apply(function() { Spinner.stop() })
                });
            });
        }
    };
                       
    $scope.login = function() {
        Spinner.start();
        if($scope.loginForm.email.$invalid || $scope.loginForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.login($scope.credentials, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.go('/','slide');
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    $scope.logout = function() {
        Parse.logout();
        $scope.$apply(function() {
            $navigate.go('/welcome','slide');
        })
    };
                       
    $scope.resetPassword = function() {
        Spinner.start();
        if($scope.passwordResetForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.resetPassword($scope.userEmail, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.back();
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/user/user.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
});