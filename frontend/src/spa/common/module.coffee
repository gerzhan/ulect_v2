###
module and class dependecies
###
#_dependencies = [
#    'angular'
#    'cs!./namespaces'
#    'cs!dialogService/index'
#    'cs!./loadingContainer/index'
#    'angular-ui-router'
#    ]
###

###
define  [
    'angular'
    'cs!./namespaces'
    'cs!dialogService/index'
    'cs!./loadingContainer/index'
    'angular-ui-router'
    ] ,(
    angular
    namespaces
    dialogService
    loadingContainerModule
)->

    module =  angular.module namespaces.name,['ui.router','ngAnimate',  'ngResource', 'ngMessages','ui.bootstrap',dialogService,loadingContainerModule]
    module.config ["$stateProvider", "$urlRouterProvider", "AccessLevels", ($stateProvider, $urlRouterProvider, AccessLevels) ->
        $stateProvider.state("anon",
            abstract: true
            template: "<ui-view/>"
            data:
                access: AccessLevels.anon
        ).state("anon.home",
            url: "/"
            templateUrl: "templates/#{module.name.replace /\.+/g, "/"}/home.tpl.html"#"home.html"
        ).state("anon.login",
            url: "/login"
            templateUrl:"templates/#{module.name.replace /\.+/g, "/"}/auth/login.tpl.html"# "auth/login.html"
            controller: "LoginController"
        ).state "anon.register",
            url: "/register"
            templateUrl: "templates/#{module.name.replace /\.+/g, "/"}/auth/register.tpl.html"#"auth/register.html"
            controller: "RegisterController"

        #            $stateProvider.state("user",
        #                abstract: true
        #                template: "<ui-view/>"
        #                data:
        #                    access: AccessLevels.user
        #            ).state "user.profile",
        #                url: "/profile"
        #                templateUrl: "user/profile.tpl.html"
        #                controller: "MessagesController"

        $urlRouterProvider.otherwise "/"
        return
    ]
    return module