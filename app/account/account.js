automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/edit_account', {
        controller:'AccountController',
        templateUrl:'app/account/account.html'
    });
}])

automizeApp.controller('AccountController', function($scope, $location, $anchorScroll, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
    $scope.activate = function(id) {
        $location.hash(id);
        $anchorScroll();
    }
                       
    $scope.getUserDetail = function() {
        Spinner.start();
        Parse.getUserDetail(function(result) {
            $scope.$apply(function() {
                $scope.userDetail = {
                    "address": result.get('address'),
                    "address2": result.get('address2'),
                    "city": result.get('city'),
                    "state": result.get('state'),
                    "zipcode": result.get('zipcode'),
                    "username": $scope.user.get('username'),
                    "firstName": $scope.user.get('firstName'),
                    "lastName": $scope.user.get('lastName')
                };
                                                         
                Spinner.stop();
            })
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
    };
                       
    $scope.updateAccount = function() {
        Spinner.start();
                       
        if($scope.editAccountForm.firstName.$invalid || $scope.editAccountForm.lastName.$invalid) {
            navigator.notification.alert(Parse.nameInvalid.message, function() {}, Parse.nameInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.editAccountForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.editAccountForm.address.$invalid || $scope.editAccountForm.city.$invalid || $scope.editAccountForm.state.$invalid || $scope.editAccountForm.zipcode.$invalid) {
            navigator.notification.alert(Parse.addressInvalid.message, function() {}, Parse.addressInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.updateAccount($scope.userDetail, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.back();
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    init();
                       
    function init() {
        $scope.user = Parse.getUser();
    };
                       
    $scope.userDetail = {};
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/account/account.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
                       
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
});