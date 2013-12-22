automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/settings', {
        controller:'SettingsController',
        templateUrl:'app/settings/settings.html'
    });
}])

automizeApp.controller('SettingsController', function($scope, $location, $navigate, Parse) {
    $scope.$navigate = $navigate;
    
    $scope.logout = function() {
        Parse.logout();
        $scope.$apply(function() {
            $navigate.go('/welcome','slide');
        })
    };
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/settings/settings.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
});