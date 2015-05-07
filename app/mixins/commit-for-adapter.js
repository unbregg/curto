/**
 * Created by unbregg on 2015/4/30.
 */
import DS from 'ember-data';
import BuildUrlMixin from '../mixins/build-url';
import Ember from 'ember';

var get = Ember.get;

function _extractId(options) {
    var requestData = get(options, 'requestData'),
        id = null;
    if (!Ember.isArray(requestData) && typeof requestData === 'object') {
        id = get(requestData, 'id');
    }
    return id;
}
export default Ember.Mixin.create({
    commit(store, type, options) {
        options = options || {};
        var id = _extractId(options),
            requestType, requestData;

        requestType = get(options, 'requestType');
            requestData = this.serializeRequestData(store, type, options);
        return this.ajax(this.buildURL(type.typeKey, id, options, 'commit'), requestType, {data: requestData});
    },
    serializeRequestData(store, type, options) {
        var requestType = get(options, 'requestType'),
            snapshot = get(options, 'snapshot'),
            owner = get(options, 'owner'),
            typeName = get(options, 'type'),
            serializer = store.serializerFor(type.typeKey),
            result = null;

        switch (requestType) {
            case 'post' :
            {

            }
            case 'put' :
            {
                result = this._serializeIntoHash(serializer, type, snapshot);
                break;
            }
            case 'delete' :
            {
                if (Ember.isArray(snapshot)) {
                    result = snapshot.mapBy('id');
                }
                break;
            }
        }
        return result;
    },
    /**
     * @private
     */
    _serializeIntoHash(serializer, type, snapshots) {
        //var data = {};
        if (Ember.isArray(snapshots) && Ember.isPresent(snapshots)) {
            var records = snapshots.map((snapshot)=> {
                var json = {};
                serializer.serializeIntoHash(json, type, snapshot, {includeId: true});
                return json;
            });
            //data[this.pathForType(type.typeKey)] = records;
            return records;
        } else {
            return serializer.serializeIntoHash({}, type, snapshots, {includeId: true});
        }
    }
});