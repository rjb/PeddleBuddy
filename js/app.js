'use strict';

var automizeApp = angular.module('automizeApp', ['ngMobile', 'ajoslin.mobile-navigate', 'angularSpinner', 'ParseUser', 'ngSanitize'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', 			  	 { controller:'HomeController', 	templateUrl:'partials/home.html' }).
            when('/more',			 { controller:'PageController', 	templateUrl:'partials/more.html' }).
            when('/about',			 { controller:'PageController', 	templateUrl:'partials/about.html' }).
            when('/faq',			 { controller:'PageController', 	templateUrl:'partials/faq.html' }).
            when('/contact',		 { controller:'PageController', 	templateUrl:'partials/contact.html' }).
            when('/privacy',		 { controller:'PageController', 	templateUrl:'partials/privacy.html' }).
            when('/tos',             { controller:'PageController', 	templateUrl:'partials/tos.html' }).
            when('/welcome', 		 { controller:'WelcomeController', 	templateUrl:'partials/welcome.html' }).
			when('/login', 			 { controller:'LoginController', 	templateUrl:'partials/login.html' }).
			when('/signup', 		 { controller:'LoginController', 	templateUrl:'partials/signup.html' }).
            when('/reset_password',  { controller:'LoginController', 	templateUrl:'partials/reset_password.html' }).
			when('/sell', 	 		 { controller:'ListingsController', templateUrl:'partials/sell.html' }).
			when('/listings', 		 { controller:'ListingsController', templateUrl:'partials/listings.html' }).
			when('/listings/:pOjId', { controller:'ListingsController', templateUrl:'partials/listing.html' }).
			when('/account', 	  	 { controller:'AccountController',  templateUrl:'partials/account_settings.html' }).
			when('/account/payment', { controller:'AccountController',  templateUrl:'partials/payment_settings.html' }).
			otherwise({ redirectTo: '/welcome' });
	}])
    .run(function($userLoggedIn, $location){
         if ($userLoggedIn()) {
            $location.path('/');
         } else {
            $location.path('/welcome');
         }
     });