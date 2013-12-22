automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/support', {
        controller:'PageController',
        templateUrl:'app/pages/support.html'
    }).when('/faq', {
        controller:'PageController',
        templateUrl:'app/pages/faq.html'
    }).when('/privacy', {
        controller:'PageController',
        templateUrl:'app/pages/privacy.html'
    }).when('/tos', {
        controller:'PageController',
        templateUrl:'app/pages/tos.html'
    }).when('/user-agreement', {
        controller:'PageController',
        templateUrl:'app/pages/user-agreement.html'
    });
}])

automizeApp.controller('PageController', function($scope, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
    $scope.pageContent = {};
                       
    $scope.getPage = function(title) {
        Spinner.start();
        var pageTitle = title;
        Parse.getPage(pageTitle, function(result) {
            $scope.$apply(function() {
                var page = result;
                $scope.title = page.get('title');
                $scope.content = page.get('content');
                Spinner.stop();
            })
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
    };
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/pages/pages.css';
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