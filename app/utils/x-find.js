/**
 * Created by unbregg on 2015/4/30.
 */
import Ember from 'ember';
import {
    _bind,
    _guard,
    _objectIsAlive,
    serializerForAdapter
    } from "./ember-data-common";
import {
    getRelationName
    } from '../utils/relation-name';
var Promise = Ember.RSVP.Promise,
    get = Ember.get;
function _getExtraction(options) {
    var relationName = getRelationName(options),
        payloadType = get(options, 'payloadType');
    if (payloadType === 'object') {
        return 'find';
    }
    switch (relationName) {
        case 'manyToMany' :
        {
            return 'findManyToMany';
        }
        default :
        {
            return 'findMany';
        }
    }
}
/**
 * 查找单个
 * @param adapter
 * @param store
 * @param type
 * @param record
 * @param options
 * @returns {*}
 * @private
 */
function _findOne(adapter, store, type, record, options) {
    var id = get(record, 'id');
    var promise = adapter.xFind(store, type, options);
    var serializer = serializerForAdapter(store, adapter, type);
    var label = "DS: Handle Adapter#find of " + type + " with id: " + id;

    promise = Promise.cast(promise, label);
    promise = _guard(promise, _bind(_objectIsAlive, store));

    return promise.then(function (adapterPayload) {
        Ember.assert("You made a request for a " + type.typeKey + " with id " + id + ", but the adapter's response did not have any data", adapterPayload);
        return store._adapterRun(function () {
            var payload = serializer.extract(store, type, adapterPayload, id, 'find');

            if(payload){
                return store.push(type, payload);
            }else{
                return adapterPayload;
            }
        });
    }, function (error) {
        var record = store.getById(type, id);
        if (record) {
            record.notFound();
            if (get(record, 'isEmpty')) {
                store.unloadRecord(record);
            }
        }
        throw error;
    }, "DS: Extract payload of '" + type + "'");
}
/**
 * 查找多个
 * @param adapter
 * @param store
 * @param type
 * @param recordArray
 * @param options
 * @returns {*}
 * @private
 */
function _findMany(adapter, store, type, recordArray, options) {
    var relationName = getRelationName(options);
    var serializer = serializerForAdapter(store, adapter, type);
    var label = "DS: Handle Adapter#xFind of " + type;
    var promise = adapter.xFind(store, type, options);

    promise = Promise.cast(promise, label);
    promise = _guard(promise, _bind(_objectIsAlive, store));

    return promise.then(function (adapterPayload) {
        var payload;
        store._adapterRun(function () {
            var extraction = _getExtraction(options);
            payload = serializer.extract(store, type, adapterPayload, null, extraction);

            Ember.assert("The response from a xFind must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');
            if(payload){
                store.pushMany(type, payload);
            }else{
                payload = adapterPayload;
            }
        });

        recordArray.load(payload);
        return recordArray;
    }, null, "DS: Extract payload of findAll " + type);
}
export function _xFind(adapter, store, type, recordArray, options) {
    if (Ember.isArray(recordArray)) {
        return _findMany(adapter, store, type, recordArray, options);
    } else {
        return _findOne(adapter, store, type, recordArray, options);
    }
}