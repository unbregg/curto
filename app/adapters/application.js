/* jshint undef: true, unused: false */

import DS from 'ember-data';
import BuildUrlMixin from '../mixins/build-url';
import Ember from 'ember';
import HTTPError from '../utils/errors';


//noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export default DS.RESTAdapter.extend(BuildUrlMixin, {
  /**
   * Handle Business Error(With http code neither 200-300 nor 304)
   * 所有通过Ember-Data发起的请求,如果后端返回的HttpCode不处于200-300区间,也不是304,则会进入此钩子
   * 该钩子内部针对不同的HttpCode包装为不同的 Error并抛出.
   * @param jqXHR
   * @returns {*}
   * @param responseText
   * @param error
   */
    ajaxError(jqXHR, responseText, error) {
    if (jqXHR && jqXHR.status === 422) {
      var message = Ember.get(jqXHR, 'responseJSON.error.message');
      return new HTTPError(jqXHR.status, message);
    }

    return new HTTPError(jqXHR.status);
  },
  /**
   * Bulk Delete
   * @param store
   * @param type
   * @param snapshots
   * @returns {*}
   */
    bulkDelete(store, type, snapshots) {
    var ids = snapshots.mapBy('id');
    return this.ajax(this.buildURL(type.typeKey, ids, snapshots, 'resourceOperation', 'bulkDelete'), 'DELETE', {data: {ids: ids}});
  },
  /**
   *
   * @param store
   * @param type
   * @param snapshots
   * @returns {*}
   */
    bulkCreate(store, type, snapshots) {
    var serializer = store.serializerFor(type.typeKey);
    var data = this._serializeIntoHash(serializer, type, snapshots);
    return this.ajax(this.buildURL(type.typeKey, null, snapshots, 'resourceOperation', 'bulkCreate'), 'POST', {data: data});
  },
  /**
   *
   * @param store
   * @param type
   * @param snapshots
   * @returns {*}
   */
    bulkUpdate(store, type, snapshots) {
    var serializer = store.serializerFor(type.typeKey);
    var data = this._serializeIntoHash(serializer, type, snapshots);
    return this.ajax(this.buildURL(type.typeKey, null, snapshots, 'resourceOperation', 'bulkUpdate'), 'PUT', {data: data});
  },
  /**
   * @private
   */
    _serializeIntoHash(serializer, type, snapshots) {
    if (Ember.isArray(snapshots) && Ember.isPresent(snapshots)) {
      return snapshots.map((snapshot)=> {
        var json = {};
        serializer.serializeIntoHash(json, type, snapshot, {includeId: true});
        return json;
      });
    }
  },
  /**
   * findOne
   * @param store
   * @param type
   * @param query
   * @returns {*}
   */
    findOne(store, type, query) {
    var url = this.buildURL(type.typeKey, null, null, 'resourceOperation', 'findOne');
    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }
    return this.ajax(url, 'GET', {data: query});
  },
  /**
   *
   * @param store
   * @param type
   * @param id
   * @param snapshot
   * @returns {*}
   */
    isExists(store, type, id, snapshot) {
    return this.ajax(this.buildURL(type.typeKey, id, snapshot, 'recordOperation', 'exists'), 'GET');
  },
  /**
   *
   * @param store
   * @param type
   * @param query
   * @returns {*}
   */
    count(store, type, query) {
    return this.ajax(this.buildURL(type.typeKey, null, null, 'resourceOperation', 'count'), 'GET', {data: query});
  },
  /**
   * TODO should it be called in store?
   * @param type
   * @param field
   * @returns {*}
   */
    uniqueness(type, field) {
    return this.ajax(this.buildURL(type.typeKey, null, null, 'resourceOperation', field + '/uniqueness'), 'GET');
  }
});
