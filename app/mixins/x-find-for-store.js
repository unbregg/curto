/**
 * Created by unbregg on 2015/4/30.
 */
import DS from 'ember-data';
import Ember from 'ember';
import {
    promiseObject,
    promiseArray,
    //promiseManyArray
    } from '../utils/ember-data-common';
import {
    _xFind
    }from '../utils/x-find';
import{
    isManyToMany
    }
    from 'curto/utils/relation-name';
var get = Ember.get;
function coerceId(id) {
    return id == null ? null : id + '';
}
/**
 * @desc 后端返回的数据类型(object/array)
 * @param options
 * @returns {*}
 * @private
 */
function _extractPayloadType(options) {
    var recordId = get(options, 'recordId'),
        payloadType = get(options, 'payloadType');
    if (!payloadType) {
        payloadType = recordId ? 'object' : 'array';
    }
    return payloadType;
}
export default Ember.Mixin.create({
    xFind(options) {
        var payloadType = _extractPayloadType(options),
            owner = get(options, 'owner'),
            typeName = get(options, 'type'),
            query = get(options, 'requestData'),
            recordId = get(options, 'recordId');
        if (owner) {
            typeName = get(owner, typeName + '.type.typeKey');
        }
        var array, type, adapter;
        options.payloadType = payloadType;
        Ember.assert('xFind: Invalid  ', typeName);
        adapter = this.adapterFor(typeName);

        type = this.modelFor(typeName);
        if (payloadType === 'object') {
            if (recordId) {
                return this.xFindById(typeName, coerceId(recordId), null, options);
            }
            return promiseObject(_xFind(adapter, this, type, null, options));
        }
        array = this.recordArrayManager
            .createAdapterPopulatedRecordArray(type, query);
        return promiseArray(_xFind(adapter, this, type, array, options));
    },
    xFindById: function (typeName, id, preload, options) {

        var type = this.modelFor(typeName);
        var record = this.recordForId(type, id);

        return this._xFindByRecord(record, preload, options);
    },

    _xFindByRecord: function (record, preload, options) {
        var fetchedRecord;

        if (preload) {
            record._preloadData(preload);
        }

        if (get(record, 'isEmpty')) {
            fetchedRecord = this.scheduleXFetch(record, options);
            //TODO double check about reloading
        } else if (get(record, 'isLoading')) {
            fetchedRecord = record._loadingPromise;
        }

        return promiseObject(fetchedRecord || record, "DS: Store#findByRecord " + record.typeKey + " with id: " + get(record, 'id'));
    },
    scheduleXFetch : function(record, options){
        var type = record.constructor;
        if (Ember.isNone(record)) { return null; }
        if (record._loadingPromise) { return record._loadingPromise; }

        var resolver = Ember.RSVP.defer('Fetching ' + type + 'with id: ' + record.get('id'));
        var recordResolverPair = {
            record: record,
            resolver: resolver,
            options : options
        };
        var promise = resolver.promise;

        record.loadingData(promise);

        if (!this._pendingXFetch.get(type)) {
            this._pendingXFetch.set(type, [recordResolverPair]);
        } else {
            this._pendingXFetch.get(type).push(recordResolverPair);
        }
        Ember.run.scheduleOnce('afterRender', this, this.flushAllPendingXFetches);

        return promise;
    },

    flushAllPendingXFetches: function() {
        if (this.isDestroyed || this.isDestroying) {
            return;
        }

        this._pendingXFetch.forEach(this._flushPendingXFetchForType, this);
        this._pendingXFetch = Ember.Map.create();
    },

    _flushPendingXFetchForType: function (recordResolverPairs, type) {
        var store = this;
        var adapter = store.adapterFor(type);
        var shouldCoalesce = !!adapter.findMany && adapter.coalesceFindRequests;
        var records = Ember.A(recordResolverPairs).mapBy('record');

        function _fetchRecord(recordResolverPair) {
            recordResolverPair.resolver.resolve(store.xFetchRecord(recordResolverPair.record,recordResolverPair.options));
        }

        function resolveFoundRecords(records) {
            Ember.forEach(records, function(record) {
                var pair = Ember.A(recordResolverPairs).findBy('record', record);
                if (pair) {
                    var resolver = pair.resolver;
                    resolver.resolve(record);
                }
            });
            return records;
        }

        function makeMissingRecordsRejector(requestedRecords) {
            return function rejectMissingRecords(resolvedRecords) {
                resolvedRecords = Ember.A(resolvedRecords);
                var missingRecords = requestedRecords.reject(function(record) {
                    return resolvedRecords.contains(record);
                });
                if (missingRecords.length) {
                    Ember.warn('Ember Data expected to find records with the following ids in the adapter response but they were missing: ' + Ember.inspect(Ember.A(missingRecords).mapBy('id')), false);
                }
                rejectRecords(missingRecords);
            };
        }

        function makeRecordsRejector(records) {
            return function (error) {
                rejectRecords(records, error);
            };
        }

        function rejectRecords(records, error) {
            Ember.forEach(records, function(record) {
                var pair = Ember.A(recordResolverPairs).findBy('record', record);
                if (pair) {
                    var resolver = pair.resolver;
                    resolver.reject(error);
                }
            });
        }

        if (recordResolverPairs.length === 1) {
            _fetchRecord(recordResolverPairs[0]);
        } else if (shouldCoalesce) {

            // TODO: Improve records => snapshots => records => snapshots
            //
            // We want to provide records to all store methods and snapshots to all
            // adapter methods. To make sure we're doing that we're providing an array
            // of snapshots to adapter.groupRecordsForFindMany(), which in turn will
            // return grouped snapshots instead of grouped records.
            //
            // But since the _findMany() finder is a store method we need to get the
            // records from the grouped snapshots even though the _findMany() finder
            // will once again convert the records to snapshots for adapter.findMany()

            var snapshots = Ember.A(records).invoke('_createSnapshot');
            var groups = adapter.groupRecordsForFindMany(this, snapshots);
            Ember.forEach(groups, function (groupOfSnapshots) {
                var groupOfRecords = Ember.A(groupOfSnapshots).mapBy('record');
                var requestedRecords = Ember.A(groupOfRecords);
                var ids = requestedRecords.mapBy('id');
                if (ids.length > 1) {
                    this._findMany(adapter, store, type, ids, requestedRecords).
                        then(resolveFoundRecords).
                        then(makeMissingRecordsRejector(requestedRecords)).
                        then(null, makeRecordsRejector(requestedRecords));
                } else if (ids.length === 1) {
                    var pair = Ember.A(recordResolverPairs).findBy('record', groupOfRecords[0]);
                    _fetchRecord(pair);
                } else {
                    Ember.assert("You cannot return an empty array from adapter's method groupRecordsForFindMany", false);
                }
            });
        } else {
            Ember.forEach(recordResolverPairs, _fetchRecord);
        }
    },
    xFetchRecord : function(record, options){
        var type = record.constructor;
        var adapter = this.adapterFor(type);

        Ember.assert("You tried to find a record but you have no adapter (for " + type + ")", adapter);
        Ember.assert("You tried to find a record but your adapter (for " + type + ") does not implement 'find'", typeof adapter.find === 'function');

        var promise = _xFind(adapter, this, type, record, options);
        return promise;
    },
    init : function(){
        this._super();
        this._pendingXFetch = Ember.Map.create();
    }
});