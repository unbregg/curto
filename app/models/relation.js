/**
 * Created by unbregg on 2015/4/30.
 */
import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr,
    get = Ember.get;
var Relation = DS.Model.extend({
    principalType: attr(),
    principalId: attr(),
    type: attr(),
    objectId: attr()
});
Relation.reopenClass({
    master: {
        sysRole: ['sysUser', 'sysGroup', 'sysPosition', 'sysOrg', 'sysDept'],
        sysUser: ['sysPosition', 'sysGroup'],
        wfProcessDefinition: ['sysUser', 'sysGroup', 'sysPosition', 'sysOrg', 'sysDept']
    },
    _getActionByRequestType: function (requestType) {
        switch (requestType) {
            case 'post':
            {
                return 'saveHasMany';
            }
            case 'delete':
            {
                return 'deleteHasMany';
            }
        }
    },
    operateHasMany: function (options) {
        var owner = get(options, 'owner'),
            typeName = get(options, 'type'),
            requestType = get(options, 'requestType'),
            requestData = Ember.makeArray(get(options, 'requestData')),
            action = this._getActionByRequestType(requestType),
            masterName, master;
        masterName = this.getMasterBetween(owner, typeName);
        if (masterName && get(owner, 'constructor.typeKey') === masterName) {
            master = owner;
        } else {
            master = requestData;
            requestData = owner;
        }
        return this[action](master, requestData);
    },
    deleteHasMany: function (master, records) {
        var relations = this.getBetween(master, records),
            relation;
        if (relations.length > 1) {
            return this.store.commit({
                requestData: relations,
                requestType: 'delete',
                urlSuffix : 'bulkDelete'
            });
        } else {
            relation = relations[0];
            relation.deleteRecord();
            return this.store.commit({
                requestData: relation,
                requestType: 'delete'
            });
        }
    },
    saveHasMany: function (master, records) {
        var relations = this.createHasMany(master, records),
            relation;
        if (relations.length > 1) {
            return this.store.commit({
                requestData: relations,
                requestType: 'post',
                urlSuffix : 'bulkCreate'
            });
        } else {
            relation = relations[0];
            return this.store.commit({
                requestData: relation,
                requestType: 'post'
            });
        }
    },
    createHasMany: function (master, record) {
        var relations = [],
            store = this.store,
            typeKey = this.typeKey,
            principalType;
        if (Ember.isArray(master)) {
            principalType = record.constructor.typeKey.capitalize();
            master.forEach(function (m) {
                var relation = store.createRecord(typeKey, {
                    objectId: get(m, 'id'),
                    type: m.constructor.typeKey,
                    principalId: get(record, 'id'),
                    principalType: principalType
                });
                relations.addObject(relation);
            });
        } else {
            principalType = record[0].constructor.typeKey.capitalize();
            record.forEach(function (r) {
                var relation = store.createRecord(typeKey, {
                    objectId: get(master, 'id'),
                    type: master.constructor.typeKey,
                    principalId: get(r, 'id'),
                    principalType: principalType
                });
                relations.addObject(relation);
            });
        }
        return relations;
    },
    getMasterBetween: function (record, link) {
        var master = get(this, 'master'),
            masterName = '', name1, name2;
        var isMaster = function (masterName, name) {
            return (Ember.isArray(master[masterName]) && master[masterName].
                filter(function (val) {
                    return val === name
                }).length > 0);
        };
        try {
            if (typeof record === 'object' && typeof link === 'string') {
                name1 = get(record, 'constructor.typeKey');
                name2 = get(record, link + '.type.typeKey');
            } else {
                name1 = record.toString();
                name2 = link.toString();
            }
            if (isMaster(name1, name2)) {
                masterName = name1;
            }
            if (isMaster(name2, name1)) {
                masterName = name2;
            }
            return masterName;
        } catch (e) {
            return masterName;
        }
    },
    getBetween: function (master, record) {
        var all = this.store.all(this),
            relations = [];
        if (Ember.isArray(master)) {
            relations = all.filter(function (relation) {
                return (get(relation, 'principalId') === get(record, 'id'));
            }).filter(function (relation) {
                for (var i = 0, l = master.length; i < l; i++) {
                    return (get(master[i], 'id') === get(relation, 'objectId'));
                }
            });
        } else {
            relations = all.filter(function (relation) {
                return (get(relation, 'objectId') === get(master, 'id'));
            }).filter(function (relation) {
                for (var i = 0, l = record.length; i < l; i++) {
                    return (get(record[i], 'id') === get(relation, 'principalId'));
                }
            });
        }
        return relations;
    }
});
export default Relation;
