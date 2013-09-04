'use strict';

automizeApp.factory('Navigation', function($navigate) {
    return {
        slidePage: function (path,type) {
            $navigate.go(path,type);
        },
        back: function () {
            $navigate.back();
        }
    }
});

// Loading Spindle Widget
automizeApp.factory('Widget', function() {
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

automizeApp.factory('Notification', function() {
    return {
        emailErrorTitle: "Invalid Email Address",
        emailErrorMessage: "Please check your email address.",
        
        passwordErrorTitle: "Password Is Too Short",
        passwordErrorMessage: "It must be at least 6 characters."
    };
});

// Parse Service
automizeApp.factory('Parse', function() {
	Parse.initialize("HtjnRGYhpDYLR0nr9RpzHaVoeTFPYzipwGUaqcnr", "udOXbcxu1ewji0D2BziyRFd7EnrNyLkrWcMd4vEo");
						
	return {
		addListing: function(_listing, _photos, callback) {
			var Listing = Parse.Object.extend("Listing");
			var ListingPhoto = Parse.Object.extend("ListingPhoto");
        
            var promiseOne = [];
            var thePhotos = [];
            
            for(var i=0; i<_photos.length; i++) {
                var name = "listing-photo.jpg";
                var file = _photos[i];
                
                var parseFile = new Parse.File(name, {base64:file});
                    
                var privateListingPhoto = new ListingPhoto();
                privateListingPhoto.set("photo", parseFile);
                    
                promiseOne.push(privateListingPhoto.save());
                thePhotos.push(privateListingPhoto);
            }
                    
            Parse.Promise.when(promiseOne).then(function() {
                // Listing
                var privateListing = new Listing();
               
                privateListing.setACL(new Parse.ACL(Parse.User.current()));
                privateListing.set("sellerDescription", _listing.sellerDescription);
                privateListing.set("sellerPrice", _listing.sellerPrice);
                privateListing.set("condition", _listing.condition);
                privateListing.set("photos", thePhotos);

                // Initials... MOVE TO CLOUD CODE!!!!!!!!!!!
                privateListing.set("state", "Pending");
                
                privateListing.save();
            }).then(function() {
                callback();
            }, function(error) {
                navigator.notification.alert(error.message,function() {},"Oops!","Close");
            });
		},
		getListings: function(callback) {
			var Listing = Parse.Object.extend("Listing");
			var query = new Parse.Query(Listing);
            
            query.include("photos");
			query.descending("updatedAt");
            query.limit(10);

			query.find({
				success: function(results) {
        			callback(results);
				},
				error: function(error) {
					navigator.notification.alert(error.message,function() {},"Oops!","Close");
				}
			})
		},
		getListing: function(listingId, callback) {
			var Listing = Parse.Object.extend("Listing");
			var query = new Parse.Query(Listing);
			var lId = listingId;
			query.equalTo("objectId", lId);
            query.include("photos");

			query.find({
				success: function(results) {
        			callback(results[0]);
				},
				error: function(error) {
					navigator.notification.alert(error.message,function() {},"Oops!","Close");
				}
			})
		},
		login: function(_credentials, callback) {
			Parse.User.logIn(_credentials.username.toLowerCase(), _credentials.password).then(function(user) {
  				callback(user);
			}, function(error) {
  				navigator.notification.alert("Please check your email address and password.",function() {},"Login Error","OK");
			});
		},
		logout: function(callback) {
			Parse.User.logOut();
		},
        resetPassword: function(userEmail, callback) {
            Parse.User.requestPasswordReset(userEmail.toLowerCase()).then(function() {
                navigator.notification.alert("Please check your inbox.",function() {},"Reset instructions sent","OK");
                callback()
            }, function(error) {
                navigator.notification.alert("Please check your email address.",function() {},"Reset Error","Close");
            });
        },
		signUp: function(_newUser, callback) {
			var user = new Parse.User();
			user.signUp({username: _newUser.email.toLowerCase(), password: _newUser.password, telephone: _newUser.telephone}, {
				success: function(user) {
					callback(user);
			  	},
			  	error: function(user, error) {
			    	navigator.notification.alert(error.message,function() {},"Oops!","Close");
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