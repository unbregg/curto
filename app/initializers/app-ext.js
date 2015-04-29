import DS from 'ember-data';
import Ember from 'ember';
var jQuery=Ember.$;

function ajaxFix() {
  /**
   * 修复jquery在contentType='application/json'
   * 但并没有返回值的问题
   */
  jQuery.ajaxSetup({
    converters: {
      "text json": function (response) {
        response = jQuery.trim(response);
        response = response.length > 0 ? response : null;
        return jQuery.parseJSON(response);
      }
    }
  });
}

/**
 * Reopen Ember-Data基类,拓展出beSaved方法,该方法主要用于将本地修改过属性的uncommitted状态的模型
 * 更新为saved状态
 */
function reopenEDModel(){
  DS.Model.reopen({
    beSaved: function () {
      var attributes = this.serialize({includeId: true});
      var store = this.store;

      Ember.assert(`This Record Could Not Be Saved Status , It Doesn't Have Id Prop ${this}`, attributes.id);
      this._inFlightAttributes = this._attributes;
      this._attributes = Ember.create(null);
      this.adapterWillCommit();
      store.didSaveRecord(this, attributes);
    }
  });
}

export function initialize(/* container, application */) {
  reopenEDModel();
  ajaxFix();
}

export default {
  name: 'app-ext',
  initialize: initialize,
  after:'injectStore'
};
