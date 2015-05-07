import ApplicationSerializer from './application';

function _normalizePayload(type, payload){
    var typeKey = type.typeKey,
        relationKey;
    for (var p in payload) {
        if (payload.hasOwnProperty(p)) {
            if (p.indexOf(typeKey.capitalize()) > -1) {
                relationKey = p;
            }
        }
    }
    if (relationKey) {
        payload[typeKey] = payload[relationKey];
        delete payload[relationKey];
    }
    return payload;
}
export default DS.RESTSerializer.extend({
    serialize: function (record, options) {
        var json = this._super.apply(this, arguments);
        delete json.type;
        return json;
    },
    extractFindMany: function (store, type, payload, id, requestType) {
        _normalizePayload(type, payload);
        return this.extractArray(store, type, payload, id, requestType);
    },
    extractFind:function(store, type, payload, id, requestType){
        _normalizePayload(type, payload);
        return this.extractSave(store, type, payload, id, requestType);
    },
    extractCreateRecord: function (store, type, payload, id, requestType) {
        _normalizePayload(type, payload);
        return this.extractSave(store, type, payload, id, requestType);
    }
});
