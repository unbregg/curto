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
  operationOnResource() {

  },
  operationOnRecord() {

  },
  bulkDelete() {

  },
  bulkCreate() {

  },
  bulkUpdate() {

  }
});
