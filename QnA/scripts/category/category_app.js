/* global $ */

appmodule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  		// $httpProvider.interceptors.push('APIInterceptor');
        $stateProvider	        
            .state('app.create-category', {
                url:'create/category/',
                views :{
                    'content@': {
                        controller  : 'CreateCategoryController',
                        templateUrl : 'views/category/create_category.html'
                    }
                },
                params: {
                        obj: null
                    }
                })

            // .state('app.view-categories', {
            //     url:'quiz/:quizid/:categoryid/',
                // views :{
                //     'content@': {
                //         controller  : 'ViewQuizCategoriesController',
                //         templateUrl : 'views/viewcategories.html'
                //     }
                // }
            //     });
	});
