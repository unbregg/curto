import DS from 'ember-data';

export default DS.RESTAdapter.extend({
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
   * @param ids
   * @param snapshots
   * @returns {*}
   */
  bulkDelete(store, type, ids, snapshots) {
    return this.ajax(this.buildURL(type.typeKey, ids, snapshots, 'resourceOperation', 'bulkDelete'), 'DELETE', { data: { ids: ids }});
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
    return this.ajax(this.buildURL(type.typeKey, null, snapshots, 'resourceOperation', 'bulkCreate'), 'POST', { data: data});
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
    return this.ajax(this.buildURL(type.typeKey, null, snapshots, 'resourceOperation', 'bulkUpdate'), 'PUT', { data: data});
  },
  /**
   * @private
   */
  _serializeIntoHash: function (serializer, type, snapshots) {
    var data = {};
    if (Ember.isArray(snapshots) && Ember.isPresent(snapshots)) {
      var records = snapshots.map((snapshot)=> {
        var json = {};
        serializer.serializeIntoHash(json, type, snapshot, { includeId: true });
        return json;
      });
      data[this.pathForType(type.typeKey)] = records;
    }
    return data;
  }
});
