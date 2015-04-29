/* jshint undef: true, unused: false ,-W079*/
import Ember from 'ember';
import {
  _bind,
  _guard,
  _objectIsAlive,
  serializerForAdapter
  } from "./ember-data-common";

var Promise = Ember.RSVP.Promise;

/**
 * 批量删除对象
 * TODO
 *  是否该操作需要排入Ember-Data的pending队列统一执行?
 * @param adapter
 * @param store
 * @param type
 * @param records
 * @returns {*}
 * @private
 */
export function _bulkDelete(adapter, store, type, records) {
  var snapshots = Ember.A(records).invoke('_createSnapshot');
  var promise = adapter.bulkDelete(store, type, snapshots);
  var record;

  promise = Promise.cast(promise, `DS: bulk remove records ${records}`);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function () {
    for (var i = 0, l = records.length; i < l; i++) {
      record = records[i];
      record.unloadRecord();
      record.destroy(); // maybe within unloadRecord
    }
  }, null, `DS: Remove Local records ${records}`);
}

/**
 * 批量新建/批量更新模型
 * TODO:
 *  批量新建时后端返回被修改的对象数组?
 *  批量更新时后端返回被修改的对象数组?
 *  是否该操作需要排入Ember-Data的pending队列统一执行?
 * @param adapter
 * @param store
 * @param type
 * @param records
 * @param operation
 * @returns {*}
 * @private
 */
function _bulkOperation(adapter, store, type, records, operation) {
  var snapshots = Ember.A(records).invoke('_createSnapshot');
  var promise = adapter[operation](store, type, snapshots);
  var serializer = serializerForAdapter(store, adapter, type);

  promise = Promise.cast(promise, `bulk create records ${records}`);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function (adapterPayload) {
    return store._adapterRun(function () {
      var payload = serializer.extract(store, type, adapterPayload, null, 'findMany');
      Ember.assert("The response from a ${operation} must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');

      records.forEach(function(record){
        record.beSaved();
      });
      return store.pushMany(type, payload);
    });
  }, null, `DS: Extract payload of ${type}`);
}


export function _bulkCreate(adapter, store, type, records) {
  return _bulkOperation(...arguments, 'bulkCreate');
}

export function _bulkUpdate(adapter, store, type, records) {
  return _bulkOperation(...arguments, 'bulkUpdate');
}
