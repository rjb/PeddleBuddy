automizeApp.controller('NavigationController', function($scope, Navigation) {
    $scope.slidePage = function (path,type) {
        Navigation.slidePage(path,type);
    };

    $scope.back = function () {
        Navigation.back();
    };
});

automizeApp.controller('WelcomeController', function() {
});

automizeApp.controller('HomeController', function($scope, $location, Parse, Navigation) {
	$scope.logout = function() {
		Parse.logout();
		Navigation.slidePage('/welcome','slide');
	};
});

automizeApp.controller('LoginController', function($scope, $location, Parse, Navigation, Notification) {
	$scope.credentials = { username: "", password: "" };
	             
	$scope.signUp = function() {
        if($scope.signupForm.email.$error.required || $scope.signupForm.email.$error.email) {
            navigator.notification.alert(Notification.emailErrorMessage, function() {}, Notification.emailErrorTitle, "OK");
        } else if($scope.signupForm.password.$error.required || $scope.signupForm.password.$error.minlength) {
            navigator.notification.alert(Notification.passwordErrorMessage, function() {}, Notification.passwordErrorTitle, "OK");
        } else {
            Parse.signUp($scope.newUser, function() {
                $scope.$apply(function() {
                    Navigation.slidePage('/','slide');
                })
            });
        }
	};
	
	$scope.login = function() {
        if($scope.loginForm.email.$error.required || $scope.loginForm.email.$error.email) {
            navigator.notification.alert(Notification.emailErrorMessage, function() {}, Notification.emailErrorTitle, "OK");
        } else {
            Parse.login($scope.credentials, function() {
                $scope.$apply(function() {
                    Navigation.slidePage('/','slide');
                })
            });
        }
	};
                       
    $scope.resetPassword = function() {
        if($scope.signupForm.email.$error.required || $scope.signupForm.email.$error.email) {
            navigator.notification.alert(Notification.emailErrorMessage, function() {}, Notification.emailErrorTitle, "OK");
        } else {
            Parse.resetPassword($scope.userEmail, function() {
                $scope.$apply(function() {
                    Navigation.back();
                })
            });
        }
    };
});

automizeApp.controller('ListingsController', function($scope, $routeParams, $location, Parse, Widget, Navigation) {
	$scope.addListing = function() {
		Parse.addListing($scope.listing, newListingImageData, function() {
            $scope.$apply(function() {
                Navigation.slidePage('/listings','slide');
            });
		});
	};
                       
    $scope.cancelNewListing = function() {
        $scope.$apply(function() {
            Navigation.back();
        })
    };

	$scope.getListings = function() {
		Widget.setLoadingWidgetState(true);
		
		Parse.getListings(function(results) {
			$scope.$apply(function() {
				$scope.listings = results;
				Widget.setLoadingWidgetState(false);
			})
		});
	};

	$scope.getListing = function() {
		Parse.getListing($routeParams.pOjId, function(result) {
			$scope.$apply(function() {
				$scope.listing = result;
			})
		});
	};

	$scope.spinningWheelPath = function() {
		$scope.spinningWheelPath = Widget.spinningWheelPath();
	}

	$scope.showLoadingWidget = function() {
		return Widget.showLoadingWidget();
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
		$scope.user = Parse.getUser();
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

automizeApp.controller('AccountController', function($scope, $location, $anchorScroll, Parse) {
	$scope.activate = function(id) {
		$location.hash(id);
	    $anchorScroll();
	}
	
	init();
	
	function init() {
		$scope.user = Parse.getUser();
	};
});