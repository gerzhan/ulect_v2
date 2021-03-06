/**
 * Created by mmarino on 9/5/2014.
 */
angular.module('services.title', [])
.factory('titleService',['$document', function($document) {
    var suffix, title;
    suffix = title = " - MEANS Seed Project";

    return {
        setSuffix: function(s) {
            return suffix = s;
        },
        getSuffix: function() {
            return suffix;
        },
        setTitle: function(t) {
            if (suffix !== "") {
                title = t + suffix;
            } else {
                title = t;
            }
            return $document.prop('title', title);
        },
        getTitle: function() {
            return $document.prop('title');
        }
    };
}]);