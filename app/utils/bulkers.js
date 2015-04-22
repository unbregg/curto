/**
 * Created by jiangwy on 15-4-22.
 */
import {
  _bind,
  _guard,
  _objectIsAlive
  } from "ember-data/system/store/common";

import {
  serializerForAdapter
  } from "ember-data/system/store/serializers";

export function _bulkDelete(adapter, store, type, ids, records) {
  var snapshots = Ember.A(records).invoke('_createSnapshot');
  var promise = adapter.bulkDelete(store, type, ids, snapshots);
  //TODO

}

export function _bulkdCreate(adapter, store, type, records) {
  var snapshots = Ember.A(records).invoke('_createSnapshot');
  var promise = adapter.bulkDelete(store, type, snapshots);
  //TODO

}
export function _bulkUpdate(adapter, store, type, records) {
  var snapshots = Ember.A(records).invoke('_createSnapshot');
  var promise = adapter.bulkDelete(store, type, snapshots);
  //TODO

}
