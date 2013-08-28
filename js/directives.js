'use strict';

// Confirming actions 
automizeApp.directive('confirmAction', function () {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmAction || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click',function () {
            navigator.notification.confirm( msg,
                                            function(button) {
                                                if(button==2) {
                                                    scope.$eval(clickAction)
                                                }
                                            },
                                            'Are you sure?',
                                            ["No","Yes"]
            )
      });
    }
  };
});