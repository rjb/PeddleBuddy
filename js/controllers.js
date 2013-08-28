automizeApp.controller('WelcomeController', function($scope, $location) {
    $scope.shouldHide = function() {
        $scope.hidden = false;
    };
});

automizeApp.controller('HomeController', function($scope, $location, ParseService) {
	$scope.logout = function() {
		ParseService.logout();
		$location.path('/welcome');
	};
});

automizeApp.controller('LoginController', function($scope, $location, ParseService) {
	$scope.credentials = { username: "", password: "" };
	
	$scope.signUp = function() {
		ParseService.signUp($scope.newUser, function() {
			$scope.$apply(function() {
				$location.path('/');
			})
		});
	};
	
	$scope.login = function() {
		ParseService.login($scope.credentials, function() {
			$scope.$apply(function() {
				$location.path('/');
			})
		});
	};
                       
    $scope.resetPassword = function() {
        ParseService.resetPassword($scope.userEmail, function() {
            $scope.$apply(function() {
                $location.path('/login');
            })
        })
    };
});

automizeApp.controller('ListingsController', function($scope, $routeParams, $location, ParseService, WidgetService) {
	$scope.addListing = function() {
		ParseService.addListing($scope.listing, newListingImageData, function() {
            $scope.$apply(function() {
                $location.path('/listings');
            });
		});
	};
                       
    $scope.cancelNewListing = function() {
        $scope.$apply(function() {
           $location.path('/');
        })
    };

	$scope.getListings = function() {
		WidgetService.setLoadingWidgetState(true);
		
		ParseService.getListings(function(results) {
			$scope.$apply(function() {
				$scope.listings = results;
				WidgetService.setLoadingWidgetState(false);
			})
		});
	};

	$scope.getListing = function() {
		WidgetService.setLoadingWidgetState(true);

		ParseService.getListing($routeParams.pOjId, function(result) {
			$scope.$apply(function() {
				$scope.listing = result;
				WidgetService.setLoadingWidgetState(false);
			})
		});
	};

	$scope.spinningWheelPath = function() {
		$scope.spinningWheelPath = WidgetService.spinningWheelPath();
	}

	$scope.showLoadingWidget = function() {
		return WidgetService.showLoadingWidget();
	};

	$scope.takePhoto = function() {
		var options =   {
        	quality: 50,
        	destinationType: navigator.camera.DestinationType.DATA_URL,
        	sourceType: 0, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
        	encodingType: 0 // 0=JPG 1=PNG
    	}
    	// Take picture using device camera and retrieve image as base64-encoded string
    	
		if ($scope.newListingPhotos.length < 6) {
			navigator.camera.getPicture(onSuccess,onFail,options);
		} else {
			navigator.notification.alert("Please delete one first.",function() {},"Too many photos!","Close");
		};
	};

	var onSuccess = function(imageData) {
    	console.log("On Success!");
    	
    	// Push image data
    	newListingImageData.push(imageData);
        
        // Push pic data
        picData = "data:image/jpeg;base64," + imageData;
        $scope.newListingPhotos.push(picData);
        $scope.$apply();
	};

	var onFail = function(e) {
    	console.log("On fail " + e);
	};


	$scope.dropPhoto = function(photo) {
		var index = $scope.newListingPhotos.indexOf(photo);
		$scope.newListingPhotos.splice(index, 1);
	};

	init();
	
	function init() {
		$scope.user = ParseService.getUser();
	};
                       
    var newListingImageData = [];
    $scope.newListingPhotos = [];
                       
    $scope.conditionOptions = [
        { name: 'Condtion?', value: '' },
        { name: 'New', value: 'new' },
        { name: 'Excellent', value: 'excellent' },
        { name: 'Very Good', value: 'very good' },
        { name: 'Good', value: 'good' },
        { name: 'Ok', value: 'ok' }
    ];
    
    $scope.listing = {condition : $scope.conditionOptions[0].value};
	$scope.listings = [];
	$scope.getListings();
	$scope.spinningWheelPath();
});

automizeApp.controller('AccountController', function($scope, $location, $anchorScroll, ParseService) {
	$scope.activate = function(id) {
		$location.hash(id);
	    $anchorScroll();
	}
	
	init();
	
	function init() {
		$scope.user = ParseService.getUser();
	};
});