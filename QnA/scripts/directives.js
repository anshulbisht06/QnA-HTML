appmodule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

appmodule.directive("katexBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.katexBind, function(value) {
                try{
                    if(value){
                        if(value!=undefined && value.indexOf("**")!=-1){
                            value.replace(/\*\*/g, "<br>");
                        }
                        katex.render(value, $element[0]);
                    }
                }catch(error){
                }
                // var $script = angular.element("<script type='math/tex'>")
                //     .html(value == undefined ? "" : value);
                // $element.html("");
                // $element.append($script);
                // MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
            });
        }]
    };
});