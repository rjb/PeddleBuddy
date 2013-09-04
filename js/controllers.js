automizeApp.controller('NavigationController', function($scope, NavigationService) {
    $scope.slidePage = function (path,type) {
        NavigationService.slidePage(path,type);
    };

    $scope.back = function () {
        NavigationService.back();
    };
});

automizeApp.controller('WelcomeController', function() {
});

automizeApp.controller('HomeController', function($scope, $location, ParseService, NavigationService) {
	$scope.logout = function() {
		ParseService.logout();
		NavigationService.slidePage('/welcome','slide');
	};
});

automizeApp.controller('LoginController', function($scope, $location, ParseService, NavigationService) {
	$scope.credentials = { username: "", password: "" };
	             
	$scope.signUp = function() {
        if($scope.signupForm.email.$error.required || $scope.signupForm.email.$error.email) {
            navigator.notification.alert("Please check your email address.", function() {}, "Invalid Email Address", "OK");
        } else if($scope.signupForm.password.$error.required || $scope.signupForm.password.$error.minlength) {
            navigator.notification.alert("Password must be at least 6 characters.", function() {}, "Password Is Too Short", "OK");
        } else {
            ParseService.signUp($scope.newUser, function() {
                $scope.$apply(function() {
                    NavigationService.slidePage('/','slide');
                })
            });
        }
	};
	
	$scope.login = function() {
        if($scope.loginForm.email.$error.required || $scope.loginForm.email.$error.email) {
            navigator.notification.alert("Please check your email address.", function() {}, "Invalid Email Address", "OK");
        } else {
            ParseService.login($scope.credentials, function() {
                $scope.$apply(function() {
                    NavigationService.slidePage('/','slide');
                })
            });
        }
	};
                       
    $scope.resetPassword = function() {
        if($scope.signupForm.email.$error.required || $scope.signupForm.email.$error.email) {
            navigator.notification.alert("Please check your email address.", function() {}, "Invalid Email Address", "OK");
        } else {
            ParseService.resetPassword($scope.userEmail, function() {
                $scope.$apply(function() {
                    NavigationService.back();
                })
            });
        }
    };
});

automizeApp.controller('ListingsController', function($scope, $routeParams, $location, ParseService, WidgetService, NavigationService) {
	$scope.addListing = function() {
		ParseService.addListing($scope.listing, newListingImageData, function() {
            $scope.$apply(function() {
                NavigationService.slidePage('/listings','slide');
            });
		});
	};
                       
    $scope.cancelNewListing = function() {
        $scope.$apply(function() {
            NavigationService.back();
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
		ParseService.getListing($routeParams.pOjId, function(result) {
			$scope.$apply(function() {
				$scope.listing = result;
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
    	
		if ($scope.newListingPhotos.length < 8) {
			navigator.camera.getPicture(onSuccess,onFail,options);
		} else {
			navigator.notification.alert("Number of photos allowed is 8.",function() {},"Too Many Photos","Close");
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