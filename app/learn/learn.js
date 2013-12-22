automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/learn', {
        controller:'LearnController',
        templateUrl:'app/learn/learn.html'
    });
}])

automizeApp.controller('LearnController', function($scope, $navigate) {
    $scope.$navigate = $navigate;
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/learn/learn.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
});