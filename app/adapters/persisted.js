/* jshint undef: true, unused: false */


import DS from 'ember-data';
import BuildUrlMixin from '../mixins/build-url';
import Ember from 'ember';

export default DS.RESTAdapter.extend(BuildUrlMixin, {
  /**
   * Handle Business Error
   * @param jqXHR
   * @returns {*}
   */
    ajaxError(jqXHR) {
    var error = this._super(...arguments);

    if (jqXHR && jqXHR.status === 422) {
      return new DS.InvalidError(Ember.$.parseJSON(jqXHR.responseText));
    } else {
      return error;
    }
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
    var data = {};
    if (Ember.isArray(snapshots) && Ember.isPresent(snapshots)) {
      var records = snapshots.map((snapshot)=> {
        var json = {};
        serializer.serializeIntoHash(json, type, snapshot, {includeId: true});
        return json;
      });
      data[this.pathForType(type.typeKey)] = records;
    }
    return data;
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
