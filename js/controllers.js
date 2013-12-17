automizeApp.controller('WelcomeController', function() {
    $scope.$navigate = $navigate;
});


automizeApp.controller('SettingsController', function($scope, $navigate, Parse) {
    $scope.$navigate = $navigate;
                       
    $scope.logout = function() {
        Parse.logout();
        $scope.$apply(function() {
            $navigate.go('/welcome','slide');
        })
    };
});

automizeApp.controller('HomeController', function($scope, $location, $navigate, Parse) {
    $scope.$navigate = $navigate;
});

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
                       
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
});

automizeApp.controller('LoginController', function($scope, $location, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
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
                    $navigate.go('/signup_two','slide');
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
	};
                       
    $scope.signUpStepTwo = function() {
        Spinner.start();
        if($scope.addressForm.$invalid) {
            Spinner.stop();
            navigator.notification.alert("Please enter a complete and valid address", function() {}, Parse.addressInvalid.title, "OK");
        } else {
            Parse.signUpStepTwo($scope.userDetail, function() {
                $scope.$apply(function() {
                    Spinner.stop();
                    $navigate.go('/signup_three', 'slide');
                }, function(error) {
                    $scope.$apply(function() { Spinner.stop() })
                });
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
                    $navigate.go('/','slide');
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
	};
                       
    $scope.logout = function() {
        Parse.logout();
        $scope.$apply(function() {
            $navigate.go('/welcome','slide');
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
                    $navigate.back();
                })
            }, function(error) {
                $scope.$apply(function() { Spinner.stop() })
            });
        }
    };
                       
    $scope.$on('broadcastSpinning', function() {
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
});

automizeApp.controller('ListingsController', function($scope, $routeParams, $location, $navigate, Parse, Spinner) {
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
});

automizeApp.controller('AccountController', function($scope, $location, $anchorScroll, $navigate, Parse, Spinner) {
    $scope.$navigate = $navigate;
                       
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
                    $navigate.back();
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
        $scope.opts = Spinner.opts;
        $scope.spinning = Spinner.spinning;
    });
});