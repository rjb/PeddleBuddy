automizeApp.controller('SpinnerController', function($scope, Spinner) {
    $scope.opts = {radius:10, width:2, length:7, lines:15, corners:1, speed:1.5, trail:75, rotate:0, top:25, left:35, color:"#ffffff"};
    $scope.$on('broadcastSpinning', function() {
        $scope.spinning = Spinner.spinning;
    });
});

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
});

automizeApp.controller('PageController', function($scope, Parse, Spinner) {
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
                       
    $scope.$on('broadcastSpinning', function() {
        $scope.spinning = Spinner.spinning;
    });
});

automizeApp.controller('LoginController', function($scope, $location, Parse, Navigation, Spinner) {
	$scope.credentials = { username: "", password: "" };
	             
	$scope.signUp = function() {
        Spinner.start();
        if($scope.signupForm.firstName.$invalid || $scope.signupForm.lastName.$invalid) {
            navigator.notification.alert(Parse.nameInvalid.message, function() {}, Parse.nameInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.signupForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.signupForm.password.$invalid) {
            navigator.notification.alert(Parse.passwordInvalid.message, function() {}, Parse.passwordInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.signUp($scope.newUser, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    Navigation.slidePage('/','slide');
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
	};
    
	$scope.login = function() {
        Spinner.start();
        if($scope.loginForm.email.$invalid || $scope.loginForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.login($scope.credentials, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    Navigation.slidePage('/','slide');
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
	};
                       
    $scope.logout = function() {
        Parse.logout();
        $scope.$apply(function() {
            Navigation.slidePage('/welcome','slide');
        })
    };
                       
    $scope.resetPassword = function() {
        Spinner.start();
        if($scope.passwordResetForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.resetPassword($scope.userEmail, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    Navigation.back();
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    $scope.$on('broadcastSpinning', function() {
        $scope.spinning = Spinner.spinning;
    });
});

automizeApp.controller('ListingsController', function($scope, $routeParams, $location, Parse, Navigation, Spinner) {
	$scope.addListing = function() {
        Spinner.start();
		Parse.addListing($scope.listing, newListingImageData, function() {
            $scope.$apply(function() {
                // Set to navigate to a success page with two options.
                // 1. Sell another 2. Go to dashboard/home.
                Spinner.stop();
                Navigation.slidePage('/sell_success','slide');
            });
		});
	};
                       
    $scope.cancelNewListing = function() {
        $scope.$apply(function() {
            Navigation.back();
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
				$scope.listing = result;
                Spinner.stop();
			})
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
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
		if ($scope.newListingPhotos.length < 8) {
			navigator.camera.getPicture(onSuccess,onFail,options);
		} else {
			navigator.notification.alert(Parse.photoInvalid.message,function() {},Parse.photoInvalid.title,"Close");
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
        $scope.spinning = Spinner.spinning;
    });
});

automizeApp.controller('AccountController', function($scope, $location, $anchorScroll, Parse, Navigation, Spinner) {
	$scope.activate = function(id) {
		$location.hash(id);
	    $anchorScroll();
	}
                       
    $scope.getUserDetail = function() {
        Spinner.start();
        Parse.getUserDetail(function(result) {
            $scope.$apply(function() {
                $scope.userDetail = {
                    "address": result.get('address'),
                    "address2": result.get('address2'),
                    "city": result.get('city'),
                    "state": result.get('state'),
                    "zipcode": result.get('zipcode'),
                    "username": $scope.user.get('username'),
                    "firstName": $scope.user.get('firstName'),
                    "lastName": $scope.user.get('lastName')
                };

                Spinner.stop();
            })
        }, function(error) {
            $scope.$apply(function() { Spinner.stop() })
        });
    };
                       
    $scope.updateAccount = function() {
        Spinner.start();
        
        if($scope.editAccountForm.firstName.$invalid || $scope.editAccountForm.lastName.$invalid) {
            navigator.notification.alert(Parse.nameInvalid.message, function() {}, Parse.nameInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.editAccountForm.email.$invalid) {
            navigator.notification.alert(Parse.emailInvalid.message, function() {}, Parse.emailInvalid.title, "OK");
            Spinner.stop();
        } else if($scope.editAccountForm.address.$invalid || $scope.editAccountForm.city.$invalid || $scope.editAccountForm.state.$invalid || $scope.editAccountForm.zipcode.$invalid) {
            navigator.notification.alert(Parse.addressInvalid.message, function() {}, Parse.addressInvalid.title, "OK");
            Spinner.stop();
        } else {
            Parse.updateAccount($scope.userDetail, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    Navigation.back();
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
	
	init();
	
	function init() {
		$scope.user = Parse.getUser();
	};
                       
    $scope.userDetail = {};
    
    $scope.$on('broadcastSpinning', function() {
        $scope.spinning = Spinner.spinning;
    });
});