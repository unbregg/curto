/**
 * Created by unbregg on 2015/5/4.
 */
import DS from 'ember-data';
import BuildUrlMixin from '../mixins/build-url';
import Ember from 'ember';
import {
    getRelationName,
    isManyToMany
    } from '../utils/relation-name';
var get = Ember.get;

function _buildUrlOfName(options) {
    var relationName = getRelationName(options);

    switch (relationName) {
        case 'manyToMany' :
        {
            return 'findManyToMany';
        }
        case 'manyToNone' :
        {
            //equal to manyToOne
        }
        case 'manyToOne' :
        {
            return 'findOneToMany';
        }
        case '' :
        {
            return 'xFind';
        }
    }
}
/**
 *
 * @param store
 * @param type
 * @param options
 * @returns {*}
 * @private
 */
function _serializeRequestData(store, type, options) {
    var requestData = get(options, 'requestData'),
        owner = get(options, 'owner'),
        typeName = get(options, 'type'),
        result = requestData;
    if (owner && typeName) {
        if (isManyToMany(owner, typeName)) {
            result = Ember.merge({
                principalType: owner.constructor.typeKey.capitalize(),
                include: type.typeKey.capitalize(),
                objectId: get(owner, 'id')
            }, requestData);
        }
    }
    return result;
}
export default Ember.Mixin.create({
    xFind: function (store, type, options) {
        var name = _buildUrlOfName(options);
        var requestData = _serializeRequestData(store, type, options);
        var id = get(options, 'recordId');
        return this.ajax(this.buildURL(type.typeKey, id, options, name), 'get', {data: requestData});
    }
});