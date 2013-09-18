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
automizeApp.factory('LoadingWidget', function() {
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

var login = angular.module('ParseUser',[]);
automizeApp.factory('$userLoggedIn', function(){
    Parse.initialize("HtjnRGYhpDYLR0nr9RpzHaVoeTFPYzipwGUaqcnr", "udOXbcxu1ewji0D2BziyRFd7EnrNyLkrWcMd4vEo");
    
    return function(){
        var currentUser = Parse.User.current();
        if (currentUser) return true;
        return false;
    };
});

automizeApp.factory('Spinner', function($rootScope) {
    var spinning = false;
    
    return {
        start: function() {
            this.spinning = true;
            this.broadcast();
        },
        stop: function() {
            this.spinning = false;
            this.broadcast();
        },
        broadcast: function() {
            $rootScope.$broadcast('broadcastSpinning');
        },
        spinning: this.spinning
    }
});

// Parse Service
automizeApp.factory('Parse', function() {
	Parse.initialize("HtjnRGYhpDYLR0nr9RpzHaVoeTFPYzipwGUaqcnr", "udOXbcxu1ewji0D2BziyRFd7EnrNyLkrWcMd4vEo");
						
	return {
        emailInvalid: {
            title: "Invalid Email Address",
            message: "Please check your email address."
        },
        passwordInvalid: {
            title: "Password Is Too Short",
            message: "It must be at least 6 characters."
        },
        loginInvalid: {
            title: "Login Error",
            message: "Please check your email address and password."
        },
        passwordResetSuccess: {
            title: "Password Reset",
            message: "Check your inbox for instructions to reset your password."
        },
        passwordResetInvalid: {
            title: "Reset Error",
            message: "Please make sure your email address is correct."
        },
        photoInvalid: {
            title: "Too Many Photos",
            message: "Number of photos allowed is 8."
        },
		addListing: function(_listing, _photos, callback) {
            // TODO: Create anonymous promise and put for loop in first then.
            // see https://www.parse.com/docs/js_guide#promises-series
            
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
                
                return privateListing.save();
            }).then(function() {
                callback();
            }, function(error) {
                navigator.notification.alert(error.message,function() {},"Oops!","Close");
            });
		},
		getListings: function(successCallback, errorCallback) {
			var Listing = Parse.Object.extend("Listing");
			var query = new Parse.Query(Listing);
            
            query.include("photos");
			query.descending("updatedAt");
            query.limit(10);
                    
            query.find().then(function(results) {
                successCallback(results);
            }, function(error) {
                navigator.notification.alert("Please go back and try again.",function() {},"Connection Error","Close");
                errorCallback(error);
            });
		},
		getListing: function(listingId, successCallback, errorCallback) {
			var Listing = Parse.Object.extend("Listing");
			var query = new Parse.Query(Listing);
			var lId = listingId;
			query.equalTo("objectId", lId);
            query.include("photos");

            query.first().then(function(results) {
                successCallback(results);
            }, function(error) {
                navigator.notification.alert("Please go back and try again.",function() {},"Connection Error","Close");
                errorCallback(error);
            });
		},
		login: function(_credentials, successCallback, errorCallback) {
            var invalidMsg = this.loginInvalid;
			Parse.User.logIn(_credentials.username.toLowerCase(), _credentials.password).then(function(user) {
  				successCallback();
			}, function(error) {
                navigator.notification.alert(invalidMsg.message,function() {},invalidMsg.title,"OK");
                errorCallback(error);
			});
		},
		logout: function(callback) {
			Parse.User.logOut();
		},
        resetPassword: function(userEmail, successCallback, errorCallback) {
            var successMsg = this.passwordResetSuccess;
            var invalidMsg = this.passwordResetInvalid;
            Parse.User.requestPasswordReset(userEmail.toLowerCase()).then(function() {
                navigator.notification.alert(successMsg.message,function() {},successMsg.title,"OK");
                successCallback();
            }, function(error) {
                navigator.notification.alert(invalidMsg.message,function() {},invalidMsg.title,"Close");
                errorCallback();
            });
        },
        // signupStepOne, signupSetpTwo, etc.
		signUp: function(_newUser, successCallback, errorCallback) {
            var user = new Parse.User();
            var userDetail = Parse.Object.extend("UserDetail");

            user.set("username", _newUser.email.toLowerCase());
            user.set("firstName", _newUser.firstName);
            user.set("lastName", _newUser.lastName);
            user.set("password", _newUser.password);
                        
            user.signUp(null).then(function() {
                var newUserDetail = new userDetail();
                newUserDetail.setACL(new Parse.ACL(Parse.User.current()));                
                return newUserDetail.save();
            }).then(function() {
                successCallback();
            }, function(error) {
                navigator.notification.alert(error.message,function() {},"Sign Up Error","Close");
                errorCallback(error);
            });
		},
		getUser: function() {
			var currentUser = Parse.User.current();
			if (currentUser) {
				return currentUser;
			}
		},
        getUserDetail: function(successCallback, errorCallback) {
            var userDetail = Parse.Object.extend("UserDetail");
            var query = new Parse.Query(userDetail);
            
            query.first().then(function(result){
                successCallback(result);
            }, function(error){
                navigator.notification.alert("Please go back and try again.",function() {},"Error","Close");
                errorCallback(error);
            });
        },
        updateAccount: function(user, successCallback, errorCallback) {
            var currentUser = Parse.User.current();
            var UserDetail = Parse.Object.extend("UserDetail");
            var query = new Parse.Query(UserDetail);
            
            query.first().then(function(result) {
                result.set("address", user.address);
                result.set("address2", user.address2);
                result.set("city", user.city);
                result.set("state", user.state);
                result.set("zipcode", user.zipcode);
                return result.save();
            }).then(function() {
                currentUser.set("username", user.username);
                currentUser.set("firstName", user.firstName);
                currentUser.set("lastName", user.lastName);
                return currentUser.save();
            }).then(function(){
                successCallback();
            }, function(error) {
                navigator.notification.alert(error.message,function() {},"Error","Close");
                errorCallback(error);
            });
        },
        getPage: function(title, successCallback, errorCallback) {
            var Page = Parse.Object.extend("Page");
            var query = new Parse.Query(Page);
            var pageTitle = title;
            
            query.equalTo("name", pageTitle);
            
            query.find().then(function(results) {
                successCallback(results[0]);
            }, function(error) {
                navigator.notification.alert("Please go back a try again.",function() {},"Connection Error","Close");
                errorCallback(error);
            });
        }
	};
});