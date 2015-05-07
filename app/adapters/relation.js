import ApplicationAdapter from './application';
import Ember from 'ember';

var get = Ember.get;
export default ApplicationAdapter.extend({
    urlForCommit: function (id, type, options) {
        var snapshot = get(options, 'snapshot'),
            masterType;

        if (Ember.isArray(snapshot)) {
            snapshot = get(snapshot, 'firstObject');
        }
        if (snapshot) {
            masterType = snapshot.attr('type');
            if (masterType) {
                type = masterType + type.capitalize();
            }
        }
        return this.xBuildURL(id, type, options);
    }
});
