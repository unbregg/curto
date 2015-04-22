/**
 * Common取自Ember-Data源码,由于Ember-Data目前未使用AMD格式包装,无法从技术手段上获取内部函数
 * 该文件只是简单拷贝自Ember-Data
 * TL;DR
 */

import DS from 'ember-data';
import Ember from 'ember';



/*packages/ember-data/lib/system/store/common.js*/
var get = Ember.get;
var Promise=Ember.RSVP.Promise; // jshint ignore:line

export function _bind(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  return function() {
    return fn.apply(undefined, args);
  };
}

export function _guard(promise, test) {
  var guarded = promise['finally'](function() {
    if (!test()) {
      guarded._subscribers.length = 0;
    }
  });

  return guarded;
}

export function _objectIsAlive(object) {
  return !(get(object, "isDestroyed") || get(object, "isDestroying"));
}


/*packages/ember-data/lib/system/store/serializers.js*/
export function serializerForAdapter(store, adapter, type) {
  var serializer = adapter.serializer;

  if (serializer === undefined) {
    serializer = store.serializerFor(type);
  }

  if (serializer === null || serializer === undefined) {
    serializer = {
      extract: function(store, type, payload) { return payload; }
    };
  }

  return serializer;
}

/* promise Object and promise Array*/
var PromiseObject=DS.PromiseObject,
    PromiseArray=DS.PromiseArray,
    PromiseManyArray=DS.PromiseManyArray;

export function promiseObject(promise, label) {
  return PromiseObject.create({
    promise: Promise.resolve(promise, label)
  });
}

export function promiseArray(promise, label) {
  return PromiseArray.create({
    promise: Promise.resolve(promise, label)
  });
}

export function proxyToContent(method) {
  return function() {
    var content = get(this, 'content');
    return content[method].apply(content, arguments);
  };
}

export function promiseManyArray(promise, label) {
  return PromiseManyArray.create({
    promise: Promise.resolve(promise, label)
  });
}
