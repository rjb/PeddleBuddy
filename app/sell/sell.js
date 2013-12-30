automizeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sell', {
        controller:'SellController',
        templateUrl:'app/sell/sell.html'
    }).when('/sell-success', {
        controller:'SellController',
        templateUrl:'app/sell/sell-success.html'
    });
}])

automizeApp.controller('SellController', function($scope, $routeParams, $location, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
    $scope.addListing = function() {
        Spinner.start();
        if($scope.newListingPhotos.length < 4 || $scope.newListingPhotos.length > 8) {
            Spinner.stop();
            navigator.notification.alert("Take 4 to 8 photos.", function() {}, "Snap more photos please", "OK");
        } else if($scope.addListingForm.sellerDescription.$invalid) {
            Spinner.stop();
            navigator.notification.alert(Parse.sellerDescInvalid.message, function() {}, Parse.sellerDescInvalid.title, "OK");
        } else {
            Parse.addListing($scope.listing, newListingImageData, function() {
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
});