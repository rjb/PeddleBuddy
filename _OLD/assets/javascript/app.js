// 'use strict';

var automizeApp = angular.module('automizeApp', [])
	.config(function($routeProvider) {
		$routeProvider.
			when('/', 			  	 { controller:'HomeController', 	templateUrl:'views/home/index.html' }).
			when('/login', 			 { controller:'LoginController', 	templateUrl:'views/sessions/login.html' }).
			when('/signup', 		 { controller:'LoginController', 	templateUrl:'views/sessions/signup.html' }).
			when('/sell', 	 		 { controller:'ListingsController', templateUrl:'views/listings/new.html' }).
			when('/listings', 		 { controller:'ListingsController', templateUrl:'views/listings/index.html' }).
			when('/listings/:pOjId', { controller:'ListingsController', templateUrl:'views/listings/show.html' }).
			when('/account', 	  	 { controller:'AccountController',  templateUrl:'views/account/index.html' }).
			when('/account/payment', { controller:'AccountController',  templateUrl:'views/account/payment.html' }).
			otherwise({ redirectTo: '/login' });
	});
	
	// Confirming actions 
	automizeApp.directive('confirmAction', function () {
	  return {
	    priority: 1,
	    terminal: true,
	    link: function (scope, element, attr) {
	      var msg = attr.confirmAction || "Are you sure?";
	      var clickAction = attr.ngClick;
	      element.bind('click',function () {
	        if ( window.confirm(msg) ) {
	          scope.$eval(clickAction)
	        }
	      });
	    }
	  };
	});

	automizeApp.directive('file', function() {
    	return {
    	    restrict: 'E',
    	    template: '<input type="file" />',
    	    replace: true,
    	    require: 'ngModel',
    	    link: function(scope, element, attr, ctrl) {
    	        var listener = function() {
    	            scope.$apply(function() {
    	                attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
    	            });
    	        }
    	        element.bind('change', listener);
    	    }
    	}
	});

	
	automizeApp.factory('WidgetService', function() {
		// Simple loading widget service. Shows a spining wheel for loading list views.
	
		// Set inital state
		var showLoadingWidget = true;

		var spinningWheelPath = "assets/images/preloader.gif";
	
		return {
			setLoadingWidgetState: function(widgetState) {
				showLoadingWidget = widgetState;
			},
			showLoadingWidget: function() {
				return showLoadingWidget;
			},
			spinningWheelPath: function() {
				return spinningWheelPath;
			}
		};
	});

	// Parse Service
	automizeApp.factory('ParseService', function() {
		Parse.initialize("HtjnRGYhpDYLR0nr9RpzHaVoeTFPYzipwGUaqcnr", "udOXbcxu1ewji0D2BziyRFd7EnrNyLkrWcMd4vEo");
				
		var myListings = [];
				
		return {
			addListing: function(_listing, _photos, callback) {
				// Check it there is a photo
                var fileUploadControl = _photos[0];
				if (fileUploadControl) {
  					var file = fileUploadControl;
  					var name = "listing-photo.jpg";
 					
                        var parseFile = new Parse.File(name, {base64:file});
				}

				// Save the image then move on
				parseFile.save().then(function() {		
					// Create listing object
				  	var Listing = Parse.Object.extend("Listing");
					var privateListing = new Listing();

					// Initials... MOVE TO CLOUD CODE!!!!!!!!!!!
					privateListing.set("state", "Pending");

					// Admin's
					// Size
					// Description
					// Title
					// Brand
					// Material
					// Category
					// Category Id
					// 

					// Seller's
					privateListing.set("sellerDescription", _listing.sellerDescription);
					privateListing.set("sellerPrice", _listing.sellerPrice);
					privateListing.set("condition", _listing.condition);

					// Set the main photo
					privateListing.set("mainPhoto", parseFile);

					// Set the ACL ownership
					privateListing.setACL(new Parse.ACL(Parse.User.current()));
 					
 					// Save the listing object
					privateListing.save();
				}).then(function() {
					callback();
				}, function(error) {
					alert("Oops! " + error.message);
				});
			},
			getListings: function(callback) {
				var Listing = Parse.Object.extend("Listing");
				var query = new Parse.Query(Listing);

				query.descending("updatedAt");

				query.find({
					success: function(results) {
            			callback(results);
					},
					error: function(error) {
						alert("Oops! " + error.message);
					}
				})
			},
			getListing: function(listingId, callback) {
				var Listing = Parse.Object.extend("Listing");
				var query = new Parse.Query(Listing);
				var lId = listingId;
				query.equalTo("objectId", lId);
				

				query.find({
					success: function(results) {
						myListing = results;
            			callback(results[0]);
					},
					error: function(error) {
						alert("Oops! " + error.message);
					}
				})
			},
			login: function(_credentials, callback) {
				Parse.User.logIn(_credentials.username, _credentials.password, {
					success: function(user) {
						callback(user);
					},
					error: function(user, error) {
						alert("Oops! " + error.message);
					}
				});
			},
			logout: function(callback) {
				Parse.User.logOut();
			},
			signUp: function(_newUser, callback) {
				var user = new Parse.User();

				user.signUp({username: _newUser.email, password: _newUser.password, telephone: _newUser.telephone}, {
					success: function(user) {
						callback(user);
				  	},
				  	error: function(user, error) {
				    	alert("Oops! " + error.message);
				  	}
				});
			},
			getUser: function() {
				var currentUser = Parse.User.current();
				if (currentUser) {
					return currentUser;
				}
			}
		};
	});

	automizeApp.controller('HomeController', function($scope, $location, ParseService) {
		$scope.logout = function() {
			ParseService.logout();
			$location.path('/login');
		};
	});
	
	automizeApp.controller('LoginController', function($scope, $location, ParseService) {
		$scope.credentials = { email: "", password: "" };
		
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
	});
	
	automizeApp.controller('ListingsController', function($scope, $routeParams, $location, ParseService, WidgetService) {
		$scope.addListing = function() {
			ParseService.addListing($scope.listing, newListingImageData, function() {
				$scope.$apply(function() {
					$location.path('/listings');
				})
			});
		};

		$scope.getListings = function() {
			WidgetService.setLoadingWidgetState(true);
			
			ParseService.getListings(function(results) {
				$scope.$apply(function() {
					WidgetService.setLoadingWidgetState(false);
					$scope.listings = results;
				})
			});
		};

		$scope.getListing = function() {
			WidgetService.setLoadingWidgetState(true);

			ParseService.getListing($routeParams.pOjId, function(result) {
				$scope.$apply(function() {
					WidgetService.setLoadingWidgetState(false);
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
                sourceType: 0,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                encodingType: 0     // 0=JPG 1=PNG
        	}
        	// Take picture using device camera and retrieve image as base64-encoded string
        	
			if ($scope.newListingPhotos.length < 8) {
				// $scope.newListingPhotos.push(new Date());
				navigator.camera.getPicture(onSuccess,onFail,options);
			} else {
				alert("Too many photos... Please delete one first!");
			};
		};

		var onSuccess = function(imageData) {
        	console.log("onSuccess!");
        	picData = "data:image/jpeg;base64," + imageData;
            $scope.newListingPhotos.push(picData);
            newListingImageData.push(imageData);
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
		
		$scope.listing = {};
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
	