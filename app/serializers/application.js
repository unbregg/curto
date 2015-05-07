import DS from 'ember-data';
import Ember from 'ember';
var $ = Ember.$;

export default DS.RESTSerializer.extend({
    /**
     * 目前后端关联关系,数据库/POJO对于belongs关联关系下的处理一般为 relationId
     * 此处统一处理
     * @param rawKey
     * @param kind
     * @returns {string}
     */
    keyForRelationship: function (rawKey, kind) {
        return kind === "belongsTo" ? rawKey + 'Id' : this._super(...arguments);
    },

    /**
     * 目前后端REST规范中并不支持如
     * POST Http://localhost/users
     * {
   *    user:{
   *        name:'Tom'
   *    }
   * }
     * 此类格式数据,在此处统一将Ember-Data数据格式调整为
     * {
   *    name:'Tom'
   * }
     * 待后端支持复杂数据格式后可进行调整
     * @param data
     * @param type
     * @param record
     * @param options
     */
    serializeIntoHash: function (data, type, record, options) {
        $().extend(data, this.serialize(record, options));
    },
    extractFindManyToMany : function(store, type, payload, id, requestType){
        var relations = [],
            keys = Ember.keys(payload),
            typeKey = type.typeKey,
            masterType;
        keys.forEach(function (key) {
            if (key.indexOf('Relations') > -1) {
                relations.addObject(key);
                masterType = key.replace('Relations', '');
            }
        });
        relations.forEach(function (relation) {
            var records = payload[relation],
                typeKeys = typeKey.pluralize(),
                result = [];
            payload[typeKeys] = result;
            store.pushPayload();
            records.forEach(function (record) {
                result.addObject(record[typeKey]);
                record.type = masterType;
            });
            payload['relations'] = payload[relation];
            delete payload[relation];
        });

        return this.extractArray(store, type, payload, id, requestType);
    }

});
