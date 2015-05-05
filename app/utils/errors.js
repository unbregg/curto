import Ember from 'ember';

var create = Ember.create;
var EmberError = Ember.Error;

var StatusCodeMsg = {
  404: '对应接口未能找到,请联系管理员',
  409: '对应资源已存在,请联系管理员',
  500: '服务器出现异常,请联系管理员'
};

/**
 * TODO 对于传入未传入message的HTTP error进行I18n
 * @param code
 * @param message
 * @param handler
 * @constructor
 */
function HTTPError(code, message, handler) {
  this.code = code;
  this.message = message || StatusCodeMsg[code] || StatusCodeMsg[500];
  this.handler = handler;
}

HTTPError.prototype = create(EmberError.prototype);
export default HTTPError;
