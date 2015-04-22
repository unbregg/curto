import Ember from 'ember';
import DS from 'ember-data';
import {
  _bulkDelete,
  _bulkCreate,
  _bulkUpdate
  } from './utils/bulkers';


export default DS.Store.extend({
  /**
   * TODO
   * @param type
   * @param ids
   * @param records
   */
  bulkDelete(type, ids, records) {
    var adapter = this.adapterFor(type);

    var promise = _bulkDelete(adapter, this, type, ids, records);
    return promise;
  },
  /**
   * TODO
   * @param type
   * @param records
   * @returns {*}
   */
  bulkCreate(type, records) {
    var adapter = this.adapterFor(type);

    var promise = _bulkCreate(adapter, this, type, records);
    return promise;
  },
  /**
   * TODO
   * @param type
   * @param records
   * @returns {*}
   */
  bulkUpdate(type, records) {
    var adapter = this.adapterFor(type);

    var promise = _bulkUpdate(adapter, this, type, records);
    return promise;
  }
});
