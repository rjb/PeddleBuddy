automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller:'HomeController',
        templateUrl:'app/home/home.html'
    });
}])

automizeApp.controller('HomeController', function($scope, $navigate) {
    $scope.$navigate = $navigate;
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/home/home.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
});