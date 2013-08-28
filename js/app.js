'use strict';

var automizeApp = angular.module('automizeApp', [])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', 			  	 { controller:'HomeController', 	templateUrl:'partials/home.html' }).
            when('/welcome', 		 { controller:'WelcomeController', 	templateUrl:'partials/welcome.html' }).
			when('/login', 			 { controller:'LoginController', 	templateUrl:'partials/accountLogin.html' }).
			when('/signup', 		 { controller:'LoginController', 	templateUrl:'partials/accountSignup.html' }).
            when('/reset_password',  { controller:'LoginController', 	templateUrl:'partials/resetPassword.html' }).
			when('/sell', 	 		 { controller:'ListingsController', templateUrl:'partials/sell.html' }).
			when('/listings', 		 { controller:'ListingsController', templateUrl:'partials/listings.html' }).
			when('/listings/:pOjId', { controller:'ListingsController', templateUrl:'partials/listing.html' }).
			when('/account', 	  	 { controller:'AccountController',  templateUrl:'partials/accountHome.html' }).
			when('/account/payment', { controller:'AccountController',  templateUrl:'partials/accountPayment.html' }).
			otherwise({ redirectTo: '/welcome' });
	}]);