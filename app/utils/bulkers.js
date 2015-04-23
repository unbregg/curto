/**
 * Created by jiangwy on 15-4-22.
 */
import Ember from 'ember';
import {
  _bind,
  _guard,
  _objectIsAlive,
  serializerForAdapter
  } from "./ember-data-common";

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
