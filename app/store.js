import DS from 'ember-data';
import Ember from 'ember';
import {
  _bulkDelete,
  _bulkCreate,
  _bulkUpdate
  } from './utils/bulkers';

import {
  _findOne,
  _count,
  _isExists
  } from './utils/ember-data-finders';
import {
  promiseObject,
  promiseArray,
  //promiseManyArray
  } from './utils/ember-data-common';

var get=Ember.get;

export default DS.Store.extend({
  /**
   * 批量删除一组模型.
   * 如 store.bulkDelete('user',users);
   * @param records
   */
    bulkDelete(records) {
    var adapter, typeName = get(records, 'firstObject.typeKey');
    Ember.assert('BulkOperation: Invalid Arguments', typeName);
    adapter = this.adapterFor(typeName);

    return promiseArray(_bulkDelete(adapter, this, typeName, records));
  },
  /**
   * 批量新建一组模型
   * 如 store.bulkCreate('user',users);
   * @param records
   * @returns {*}
   */
    bulkCreate(records) {
    var adapter, typeName = get(records, 'firstObject.typeKey');
    Ember.assert('BulkOperation: Invalid Arguments', typeName);
    adapter = this.adapterFor(typeName);

    return promiseArray(_bulkCreate(adapter, this, typeName, records));
  },
  /**
   * 批量更新一组模型
   * 如 store.bulkUpdate('user',users);
   * @param records
   * @returns {*}
   */
    bulkUpdate(records) {
    var adapter, typeName = get(records, 'firstObject.typeKey');
    Ember.assert('BulkOperation: Invalid Arguments', typeName);
    adapter = this.adapterFor(typeName);

    return _bulkUpdate(adapter, this, typeName, records);
  },

  /**
   * The FindOne Implement.
   * FindOne实现类,目前采用的方案可以实现功能,但是有一定的瑕疵
   * 瑕疵包括:
   * 1.失败时的错误处理
   *    目前设想的方案中,最优的应该是类似于findById的做法,
   *    在调用该方法时,前端create一个对应type的record,可以直接返回,
   *    如果对应的模型未找到,则抛出一个ModelNotFound类似的Error
   * 2.findOne后如果直接对对象进行操作会如何
   * @param typeName
   * @param query
   * @returns {*}
   */
    findOne(typeName, query) {
    var type = this.modelFor(typeName);
    var adapter = this.adapterFor(type);
    return promiseObject(_findOne(adapter, this, type, query));
  },

  /**
   *校验指定id的模型是否存在
   * 如 store.isExists('user',1);
   * 则会向接口/users/1/exists发起请求,验证id为1的user是否存在
   */
    isExists(typeName, id) {
    var type = this.modelFor(typeName);
    var adapter = this.adapterFor(type);
    return promiseObject(_isExists(adapter, this, type, id));
  },

  /**
   * 获取模型对象总数,
   * 如 store.count('user');
   * 则会向/users/count发起请求,获取user总数
   */
    count(typeName, query) {
    var type = this.modelFor(typeName);
    var adapter = this.adapterFor(type);
    return promiseObject(_count(adapter, this, type, query));
  }
});
