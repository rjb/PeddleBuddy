automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sell', {
        controller:'SellController',
        templateUrl:'app/sell/sell.html'
    }).when('/sell-success', {
        controller:'SellSuccessController',
        templateUrl:'app/sell/sell-success.html'
    });
}])

automizeApp.controller('SellSuccessController', function($scope, $routeParams, $location, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/sell/sell.css';
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
});

automizeApp.controller('SellController', function($scope, $routeParams, $location, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
    $scope.addListing = function() {
        if($scope.newListingPhotos.length < 4) {
            navigator.notification.alert("We need at least " + $scope.photosLeftToTake + " more", function() {}, "Snap some photos", "OK");
        } else if($scope.newListingPhotos.length > 8) {
            navigator.notification.alert("All we need is 4 to 8 photos.", function() {}, "Too many photos", "OK");
        } else if($scope.addListingForm.sellerDescription.$error.required) {
            navigator.notification.alert("Please enter a short Description of what you are selling.", function() {}, "What Are You Selling?", "OK");
        } else if($scope.addListingForm.sellerDescription.$error.pattern) {
            navigator.notification.alert("Please enter a valid Description of what you are selling. Letters and numbers only please.", function() {}, "Oops!", "OK");
        } else if($scope.addListingForm.sellerCondition.$error.pattern) {
            navigator.notification.alert("Please enter a valid Flaw. Letters and numbers only please.", function() {}, "Oops!", "OK");
        } else if($scope.addListingForm.sellerPrice.$error.pattern) {
            navigator.notification.alert("Please enter a valid Price.", function() {}, "Oops!", "OK");
        } else {
            $scope.$apply(function() {
                Spinner.start();
            });
            Parse.addListing($scope.listing, $scope.newListingPhotos, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.go('/sell-success','slide');
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
                       
    $scope.launchCamera = function() {
        var options =   {
            quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: 0, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0, // 0=JPG 1=PNG
            allowEdit: false
        }
                       
        // Take picture using device camera and retrieve image as base64-encoded string
        if ($scope.newListingPhotos.length < 80) {
            navigator.camera.getPicture(onSuccess,onFail,options);
        } else {
            navigator.notification.alert("All we need is 8 photos.",function() {},"That's Plenty","Close");
        };
    };
                    
    var onSuccess = function(imageData) {
        $scope.$apply(function() {
            $scope.newListingPhotos.push(imageData);
        });
    };
                       
    var onFail = function(message) {
        console.log("On fail " + message);
        if($scope.newListingPhotos.length === 0) {
            $scope.$apply(function() {
                $navigate.back();
            })
        }
    };
                       
    $scope.dropPhoto = function(photo) {
        $scope.$apply(function() {
            var index = $scope.newListingPhotos.indexOf(photo);
            $scope.newListingPhotos.splice(index, 1);
        });
    };
    
    $scope.photosReady = function() {
        if($scope.newListingPhotos.length >= 4 && $scope.newListingPhotos.length <= 8) {
            return true;
        } else {
            return false;
        }
    };
                       
    $scope.formReady = function() {
        // Change to:
        // return $scope.addListingForm.$valid;
        
        if($scope.addListingForm.$valid) {
            return true;
        } else {
            return false;
        }
    };
                       
    $scope.tooFewPhotos = function() {
        $scope.photosLeftToTake = 4-$scope.newListingPhotos.length;

        if($scope.photosLeftToTake <= 4 && $scope.photosLeftToTake > 0) {
            return true;
        } else {
            return false;
        }
    };
                       
    $scope.tooManyPhotos = function() {
        $scope.photosOverage = $scope.newListingPhotos.length-8;
                       
        if($scope.photosOverage > 0) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.$on('$viewContentLoaded', function() {
        $scope._style = document.createElement('link');
        $scope._style.type = 'text/css';
        $scope._style.href = 'app/sell/sell.css';
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
                       
    init();
                       
    function init() {
        $scope.user = Parse.getUser();
    };
    
    $scope.newListingPhotos = [];
    $scope.listing = {};
    $scope.listings = [];
    $scope.photosLeftToTake = "";
});