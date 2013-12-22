automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/activity', {
        controller:'ActivityController',
        templateUrl:'app/activity/activity.html'
    }).when('/activity-item/:pOjId', {
        controller:'ActivityController',
        templateUrl:'app/activity/activity-item.html'
    });
}])

automizeApp.controller('ActivityController', function($scope, $routeParams, $location, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
    $scope.addListing = function() {
        Spinner.start();
        if($scope.newListingPhotos.length < 1) {
            Spinner.stop();
            navigator.notification.alert("Take 4 to 8 photos of what you're selling.", function() {}, "Snap Some Photos", "OK");
        } else if($scope.addListingForm.sellerDescription.$invalid) {
            Spinner.stop();
            navigator.notification.alert(Parse.sellerDescInvalid.message, function() {}, Parse.sellerDescInvalid.title, "OK");
        } else {
            Parse.addListing($scope.listing, newListingImageData, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.go('/sell_success','slide');
                });
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    $scope.cancelNewListing = function() {
        $scope.$apply(function() {
            $navigate.back();
        })
    };
                       
    $scope.togglePriceOptional = function() {
        $scope.listing.sellerPrice = '';
        $scope.priceOptional = !$scope.priceOptional;
    };
                       
    $scope.toggleFlawOptional = function() {
        $scope.flawOptional = !$scope.flawOptional;
    };
    
    $scope.getListings = function() {
        Spinner.start();
        Parse.getListings(function(results) {
            $scope.$apply(function() {
                $scope.listings = results;
                Spinner.stop();
            })
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
    };
    
    $scope.getListing = function() {
        Spinner.start();
        Parse.getListing($routeParams.pOjId, function(result) {
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
    
    $scope.cancelListing = function(listingId) {
    
    };
    
    $scope.takePhoto = function() {
        var options =   {
            quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: 0, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0, // 0=JPG 1=PNG
            allowEdit: false
        }
    
        // Take picture using device camera and retrieve image as base64-encoded string
        if ($scope.newListingPhotos.length <= 8) {
            navigator.camera.getPicture(onSuccess,onFail,options);
        } else {
            navigator.notification.alert(Parse.photoInvalid.message,function() {},Parse.photoInvalid.title,"Close");
        };
    };
    
    var onSuccess = function(imageData) {
        console.log("Photo On Success!");
    
        // Push image data
        newListingImageData.push(imageData);
    
        // Push pic data
        picData = "data:image/jpeg;base64," + imageData;
        $scope.newListingPhotos.push(picData);
        $scope.$apply();
    };
    
    var onFail = function(message) {
        console.log("On fail " + message);
        navigator.notification.alert(message,function() {},"Oops!","Close");
    };
    
    
    $scope.dropPhoto = function(photo) {
        var index = $scope.newListingPhotos.indexOf(photo);
        $scope.newListingPhotos.splice(index, 1);
    };
    
    init();
    
    function init() {
        $scope.user = Parse.getUser();
    };
    
    var newListingImageData = [];
    $scope.newListingPhotos = [];
    
    $scope.listing = {};
    $scope.listings = [];
    
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
    
    $scope.$on('$viewContentLoaded', function() {
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
});