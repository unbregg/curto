/**
 * Created by unbregg on 2015/4/30.
 */
import DS from 'ember-data';
import Ember from 'ember';
import {
    promiseObject,
    promiseArray,
    //promiseManyArray
    } from '../utils/ember-data-common';
import {
    _commit
    }from '../utils/commit';
import {
    isManyToMany
    }from 'curto/utils/relation-name';
var get = Ember.get;
/**
 * 提取出模型的类型
 * @param options
 * @returns {*}
 * @private
 */
function _extractType(options) {
    var requestData = Ember.makeArray(get(options, 'requestData')),
        type = get(options, 'type');
    if (type) {
        return type;
    }
    type = get(requestData, 'firstObject.constructor.typeKey');
    return type;
}


/**
 * @desc 后端返回的数据类型(object/array)
 * @param options
 * @returns {*}
 * @private
 */
function _extractPayloadType(options) {
    var requestData = get(options, 'requestData'),
        payloadType = get(options, 'payloadType');
    if (payloadType) {
        return payloadType;
    }
    payloadType = Ember.isArray(requestData) ? 'array' : 'object';
    return payloadType;
}
export default Ember.Mixin.create({
    /*options = {
     type : '',
     owner : '',
     urlSuffix : '',
     requestType : '',//post,delete,put,get
     requestData : '',
     payloadType : '',//object,array
     serialize : ''//true,false
     }*/
    /**
     *
     * @param options
     * @returns {*}
     */
    commit(options) {
        var typeName = _extractType(options),
            payloadType = _extractPayloadType(options),
            requestData = get(options, 'requestData'),
            owner = get(options, 'owner');
        var type, adapter, relationModel;
        options.payloadType = payloadType;
        Ember.assert('commit: Invalid  ', typeName);
        if (owner && isManyToMany(owner, typeName)) {
            relationModel = this.modelFor('relation');
            requestData = Ember.makeArray(requestData);
            return relationModel.operateHasMany(options);
        } else {
            adapter = this.adapterFor(typeName);

            type = this.modelFor(typeName);
            if (payloadType === 'object') {
                return promiseObject(_commit(adapter, this, type, options));
            }
            return promiseArray(_commit(adapter, this, type, options));
        }
    }
});