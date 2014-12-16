###
module and class dependecies
###
_dependencies = [
    'angular'
    #'an'
    'cs!./namespaces'
    'cs!dialogService/index'
    'cs!./controllers/MainControllerClass'
    'cs!./services/EntityFactoryClass'
    'cs!./services/SocketEntityFactoryClass'
    'cs!./controllers/EditEntityControllerClass'
    'ng-table'
    'angular-resource'

    ]
###

###
define _dependencies ,(
    angular
    #'angularSails.io'
    namespaces
    dialogService
    MainControllerClass
    EntityFactoryClass
    SocketEntityFactoryClass
    EditEntityControllerClass

)->

    module =  angular.module namespaces.name,[dialogService,'ngTable','ngResource','ui.bootstrap']
    console.log "Edit_#{namespaces.module.name.replace /\.+/g, "_"}_Controller","Main_#{namespaces.module.name.replace /\.+/g, "_"}_Controller"
    module.controller "Edit_#{namespaces.module.name.replace /\.+/g, "_"}_Controller", EditEntityControllerClass
    module.controller "Main_#{namespaces.module.name.replace /\.+/g, "_"}_Controller", MainControllerClass


    module.factory "#{namespaces.name}EntityFactory", EntityFactoryClass
    module.factory "#{namespaces.name}SocketEntityFactoryClass", SocketEntityFactoryClass


    ###
    Directive for autoscroll list of messages
    TODO: add animation affects
    ###
    module.directive "autoscrollDown", [->
        return (scope, element, attrs) ->
            scope.$watch (->
                element.children().length
            ), (newVal,oldVal)->
                console.log 'scrooll',newVal,oldVal
                element[0].scrollTop = element.prop("scrollHeight")
                return
            return
    ]
    return module