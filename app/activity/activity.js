automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/activity', {
        controller:'ActivityController',
        templateUrl:'app/activity/activity.html'
    }).when('/activity-item/:listingId', {
        controller:'ActivityItemController',
        templateUrl:'app/activity/activity-item.html'
    });
}])

automizeApp.controller('ActivityController', function($scope, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
    
    $scope.getListings = function() {
        Spinner.start();
        Parse.getListings($scope.limit, $scope.skip, function(results) {
            $scope.$apply(function() {
                $scope.listings = $scope.listings.concat(results);
                $scope.more = results.length === $scope.limit;
                Spinner.stop();
            })
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
    };
                       
    $scope.showMore = function() {
        $scope.skip += $scope.limit;
        $scope.getListings();
    };
                       
    $scope.hasListings = function() {
        return $scope.listings.length > 0;
    };
                       
    $scope.hasMore = function() {
        return $scope.more;
    };
    
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
    
    $scope.$on('$viewContentLoaded', function() {
        $scope.getListings();
        
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/activity/activity.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
                       
                       
    init();
                       
    function init() {
        $scope.user = Parse.getUser();
    };
    
    $scope.listings = [];
    $scope.limit = 10;
    $scope.skip = 0;
    $scope.more = false;
});

automizeApp.controller('ActivityItemController', function($scope, $routeParams, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
    $scope.getListing = function() {
        Spinner.start();
        Parse.getListing($routeParams.listingId, function(result) {
            $scope.$apply(function() {
                Spinner.stop();
                $scope.listing = result;
                $scope.sellerDescription = result.get('sellerDescription');
                $scope.sellerPrice = result.get('sellerPrice');
                $scope.sellerFlaws = result.get('condition');
                $scope.photos = result.get('photos');
                $scope.state = result.get('state');
            })
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
    };
                      
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope.getListing();
        
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/activity/activity.css';
        $scope._style.rel = 'stylesheet';
        $scope._style = document.head.appendChild($scope._style);
    });
                       
    $scope.$on('$destroy', function() {
        $scope._style.parentNode.removeChild($scope._style);
        delete $scope._style;
    });
                       
    init();
                       
    function init() {
        $scope.user = Parse.getUser();
    };
                       
    $scope.listing = {};
});