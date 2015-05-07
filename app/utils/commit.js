/**
 * Created by unbregg on 2015/4/29.
 */
import Ember from 'ember';
import {
    _bind,
    _guard,
    _objectIsAlive,
    serializerForAdapter
    } from "./ember-data-common";

var Promise = Ember.RSVP.Promise,
    get = Ember.get;
/**
 * 设置快照
 * @param options
 * @returns {*}
 * @private
 */
function _setupSnapshot(options) {
    var requestData = get(options, 'requestData'),
        snapshot;
    if (Ember.isArray(requestData)) {
        snapshot = Ember.A(requestData).invoke('_createSnapshot')
    } else {
        snapshot = requestData._createSnapshot();
    }
    options.snapshot = snapshot;
    return snapshot;
}
function _deleteRecords(options){
    var requestType = get(options,'requestType'),
        requestData = get(options,'requestData');
    if(requestType === 'delete'){
        Ember.makeArray(requestData).invoke('deleteRecord');
    }
}
export function _commit(adapter, store, type, options) {
    _deleteRecords(options);
    var records = Ember.makeArray(get(options, 'requestData'));
    var payloadType = get(options, 'payloadType');
    var snapshot = _setupSnapshot(options);
    var promise = adapter['commit'](store, type, options);
    var serializer = serializerForAdapter(store, adapter, type);

    records = records.filterBy('isDirty', true);

    records.forEach(function (record) {
        record._inFlightAttributes = record._attributes;
        record._attributes = Ember.create(null);
        record.adapterWillCommit();
    });

    promise = Promise.cast(promise, `bulk create records ${records}`);
    promise = _guard(promise, _bind(_objectIsAlive, store));

    return promise.then(function (adapterPayload) {
        store._adapterRun(function () {
            var payload;
            if (adapterPayload) {
                if (payloadType === 'array') {
                    payload = serializer.extract(store, type, adapterPayload, null, 'findMany');
                } else {
                    payload = serializer.extract(store, type, adapterPayload, null, 'find');
                }
            } else {
                payload = adapterPayload;
            }
            payload = Ember.makeArray(payload);
            records.forEach(function (record, idx) {
                store.didSaveRecord(record, payload[idx]);
            });
        });
        if (payloadType === 'array') {
            return records;
        } else {
            return get(records, 'firstObject');
        }
    }, null, `DS: Extract payload of ${type}`);
}
export function _delete(adapter, store, type, options) {
    var records = get(options, 'requestData');
    _setupSnapshot(options);
    var promise = adapter.commit(store, type, options);
    var record;

    promise = Promise.cast(promise, `DS: remove record ${records}`);
    promise = _guard(promise, _bind(_objectIsAlive, store));

    return promise.then(function () {
        if (Ember.isArray(records)) {
            for (var i = 0, l = records.length; i < l; i++) {
                record = records[i];
                record.unloadRecord();
                record.destroy(); // maybe within unloadRecord
            }
        } else {
            record = records;
            record.unloadRecord();
            record.destroy();
        }

    }, null, `DS: Remove Local record ${records}`);
}
//
function _createOrUpdate(adapter, store, type, options) {
    var records = Ember.makeArray(get(options, 'requestData'));
    var payloadType = get(options, 'payloadType');
    var snapshot = _setupSnapshot(options);
    var promise = adapter['commit'](store, type, options);
    var serializer = serializerForAdapter(store, adapter, type);

    records = records.filterBy('isDirty', true);

    records.forEach(function (record) {
        record._inFlightAttributes = record._attributes;
        record._attributes = Ember.create(null);
        record.adapterWillCommit();
    });

    promise = Promise.cast(promise, `bulk create records ${records}`);
    promise = _guard(promise, _bind(_objectIsAlive, store));

    return promise.then(function (adapterPayload) {
        store._adapterRun(function () {
            var payload;
            if (adapterPayload) {
                if (payloadType === 'array') {
                    payload = serializer.extract(store, type, adapterPayload, null, 'findMany');

                } else {
                    payload = serializer.extract(store, type, adapterPayload, null, 'find');
                }
            } else {
                payload = adapterPayload;
            }
            payload = Ember.makeArray(payload);
            records.forEach(function (record, idx) {
                store.didSaveRecord(record, payload[idx]);
            });
        });
        if (payloadType === 'array') {
            return records;
        } else {
            return get(records, 'firstObject');
        }
    }, null, `DS: Extract payload of ${type}`);
}
export function _update(adapter, store, type, options) {
    return _createOrUpdate(...arguments);
}
export function _create(adapter, store, type, options) {
    return _createOrUpdate(...arguments);
}