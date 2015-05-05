/* global Messenger */
/* jshint -W064 */
import HTTPError from '../utils/errors';
import Ember from 'ember';


/**
 * 全局异常处理
 * 目前此处主要处理HTTP Error(HTTPCode不处于200-300 || 304的请求)
 * 处理方案为使用Messenger在浏览器右下角显示通用提示
 *
 * * Notice
 * 对于已捕获异常的Promise将不会冒泡至该处理函数,
 * 如 this.store.find('user').catch(function(){...});
 * 如已经进行异常捕获,并希望全局异常统一处理,请继续抛出该异常
 *    this.store.find('user').catch(function(e){
 *        //self code...
 *        throw e;
 *    });
 * 此种异常处理机制与Java的异常处理类似,具体可查 RSVP Promise
 */
function errorHanding() {
  Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air'
  };

  Ember.onerror = function (error) {
    if (error instanceof HTTPError) {
      var message = error.message;
      Messenger().post({
        message: message,
        type: 'error',
        showCloseButton: true
      });
    }
  };
}

/**
 * messenger extend
 */
function messengerExtend() {
  ['error', 'info', 'success'].forEach(function (operation) {
    Messenger[operation] = function (message) {
      return Messenger().post({
        type: operation,
        message: message,
        showCloseButton: true
      });
    };
  });
}


export function initialize(/* container, application */) {
  messengerExtend();
  errorHanding();
}

export default {
  name: 'error-handling',
  initialize: initialize
};
