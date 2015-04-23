import Ember from 'ember';
import DS from 'ember-data';
import {
  _bulkDelete,
  _bulkCreate,
  _bulkUpdate
  } from './utils/bulkers';

import {_findOne} from './utils/ember-data-finders';
import {
  promiseObject,
  //promiseArray,
  //promiseManyArray
  } from './utils/ember-data-common';


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
   *
   */
  isExists() {
    var type = this.modelFor(typeName);

    var adapter = this.adapterFor(type);
  },

  /**
   * TODO
   * cache count with query ?
   * save in metadata
   */
  count() {
    var type = this.modelFor(typeName);

    var adapter = this.adapterFor(type);
  }
});
