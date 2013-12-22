'use strict';

var automizeApp = angular.module('automizeApp', ['ngMobile', 'ajoslin.mobile-navigate', 'angularSpinner', 'ParseUser', 'ngSanitize'])
    .run(function($userLoggedIn, $location){
         if ($userLoggedIn()) {
            $location.path('/');
         } else {
            $location.path('/welcome');
         }
     });