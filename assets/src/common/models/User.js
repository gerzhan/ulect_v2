/**
 * Created by mmarino on 9/5/2014.
 */
angular.module('models.user', ['lodash', 'services', 'ngSails'])
.service('UserModel',['$q', 'lodash', 'utils', '$sails', function($q, lodash, utils, $sails) {
    this.getAll = function() {
        var deferred = $q.defer();
        var url = utils.prepareUrl('user');

        $sails.get(url, function(models) {
            return deferred.resolve(models);
        });

        return deferred.promise;
    };

    this.getOne = function(id) {
        var deferred = $q.defer();
        var url = utils.prepareUrl('user/' + id);

        $sails.get(url, function(model) {
            return deferred.resolve(model);
        });

        return deferred.promise;
    };

    this.create = function(newModel) {
        var deferred = $q.defer();
        var url = utils.prepareUrl('user');

        $sails.post(url, newModel, function(model) {
            return deferred.resolve(model);
        });

        return deferred.promise;
    };
}]);