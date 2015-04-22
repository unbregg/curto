import DS from 'ember-data';
import Ember from 'ember';

var BuildURLMixin = DS.BuildURLMixin;
export default Ember.Mixin.create(BuildURLMixin, {
  buildURL(type, id, snapshot, requestType, operation) {
    switch (requestType) {
      case 'find':
        return this.urlForFind(id, type, snapshot);
      case 'findAll':
        return this.urlForFindAll(type);
      case 'findQuery':
        return this.urlForFindQuery(id, type);
      case 'findMany':
        return this.urlForFindMany(id, type, snapshot);
      case 'findHasMany':
        return this.urlForFindHasMany(id, type);
      case 'findBelongsTo':
        return this.urlForFindBelongsTo(id, type);
      case 'createRecord':
        return this.urlForCreateRecord(type, snapshot);
      case 'deleteRecord':
        return this.urlForDeleteRecord(id, type, snapshot);
      case 'resourceOperation':
        return this.urlForResourceOperation(type, operation);
      case 'recordOperation':
        return this.urlForRecordOperation(id, type, snapshot, operation);
      default:
        return this._buildURL(type, id);
    }
  },
  /**
   *
   * @param type
   * @param operation
   * @returns {string}
   */
  urlForResourceOperation: function (type, operation) {
    return this._buildURL(type) + '/' + operation;
  },
  /**
   *
   * @param id
   * @param type
   * @param snapshot
   * @param operation
   * @returns {string}
   */
  urlForRecordOperation: function (id, type, snapshot, operation) {
    return this._buildURL(type, id) + '/' + operation;
  },

  headers: Ember.computed('serializerType', function () {
    return {
      'X-Serializer-Type': this.get('serializerType')
    };
  })
});
