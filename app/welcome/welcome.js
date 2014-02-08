automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/welcome', {
        controller:'WelcomeController',
        templateUrl:'app/welcome/welcome.html'
    });
}])

automizeApp.controller('WelcomeController', function($scope, $navigate) {
    $scope.$navigate = $navigate;
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/welcome/welcome.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
});