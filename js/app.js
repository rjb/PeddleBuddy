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
            when('/user_agreement',  { controller:'PageController', 	templateUrl:'partials/user_agreement.html' }).
            when('/welcome', 		 { controller:'WelcomeController', 	templateUrl:'partials/welcome.html' }).
			when('/login', 			 { controller:'LoginController', 	templateUrl:'partials/login.html' }).
			when('/signup', 		 { controller:'LoginController', 	templateUrl:'partials/signup.html' }).
            when('/signup_two', 	 { controller:'LoginController', 	templateUrl:'partials/signup_two.html' }).
            when('/signup_three', 	 { controller:'LoginController', 	templateUrl:'partials/signup_three.html' }).
            when('/reset_password',  { controller:'LoginController', 	templateUrl:'partials/reset_password.html' }).
			when('/sell', 	 		 { controller:'ListingsController', templateUrl:'partials/sell.html' }).
            when('/sell_success', 	 { controller:'ListingsController', templateUrl:'partials/sell_success.html' }).
			when('/listings', 		 { controller:'ListingsController', templateUrl:'partials/listings.html' }).
			when('/listings/:pOjId', { controller:'ListingsController', templateUrl:'partials/listing.html' }).
			when('/account', 	  	 { controller:'AccountController',  templateUrl:'partials/account.html' }).
			when('/edit_account', 	 { controller:'AccountController',  templateUrl:'partials/edit_account.html' }).
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