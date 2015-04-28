/* jshint -W079 */
import Ember from 'ember';
import {
  _bind,
  _guard,
  _objectIsAlive,
  serializerForAdapter
  } from "./ember-data-common";

var Promise=Ember.RSVP.Promise;

export function _findOne(adapter, store, type, query) {
  var promise = adapter.findOne(store, type, query);
  var serializer = serializerForAdapter(store, adapter, type);
  var label = "DS: Handle Adapter#findOne of " + type;

  promise = Promise.cast(promise, label);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function (adapterPayload) {
    var payload;
    payload = serializer.extract(store, type, adapterPayload, null, 'find');
    Ember.assert("The response from a findOne must be an Object, not " + Ember.inspect(payload), Ember.typeOf(payload) !== 'array');

    return store.push(type, payload);
  }, null, "DS: Extract payload of findOne " + type);
}


export function _count(adapter, store, type, query) {
  return adapter.count(store, type, query);
}


export function _isExists(adapter, store, type, id) {
  return adapter.isExists(store, type, id);
}
