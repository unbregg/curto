import Ember from 'ember';
import {
    module,
    test
    } from 'qunit';
import startApp from 'curto/tests/helpers/start-app';
import Pretender from 'pretender';
import Relation from 'curto/models/relation';
import RelationAdapter from 'curto/adapters/relation';
import RelationSerializer from 'curto/serializers/relation';
var application;
var get = Ember.get;
var store, server;
function p(request, id) {
    var result = JSON.parse(request.requestBody);
    if (!id) {
        return result;
    }
    if (Ember.isArray(result)) {
        result.forEach(function (item) {
            id = id + 1;
            item.id = id;
        });
    } else {
        result.id = id;
    }
    return result;
}
module('Acceptance: Commit', {
    beforeEach: function () {
        application = startApp();
        server = new Pretender(function () {
            /**
             * 1
             * 创建
             * url: /sysRoles
             */
            this.post('/sysRoles', function (request) {
                return [200, {"Content-Type": "application/json"}, JSON.stringify({sysRole: p(request, '1')})];
            });
            /**
             * 2
             * 批量新增
             * url:/sysRoles/bulkCreate
             */
            this.post('/sysRoles/bulkCreate', function (request) {
                return [200, {"Content-Type": "application/json"}, JSON.stringify({sysRole: p(request, '2')})];
            });

            /**
             * 3
             * 批量删除
             * url:/sysRoles/bulkDelete
             */
            this.delete('/sysRoles/bulkDelete', function (request) {
                return [204, {"Content-Type": "application/json"}];
            });

            /**
             * 4
             * 批量修改
             * url:/sysRoles/bulkUpdate
             */
            this.put('/sysRoles/bulkUpdate', function (request) {
                return [200, {"Content-Type": "application/json"}, JSON.stringify({sysRoles: p(request)})];
            });

            /**
             * 5
             * 单个资源的操作
             * url:/sysRoles/:id/operation
             */
            this.put('/sysRoles/:id/operation', function (request) {
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRole: p(request)
                })];
            });

            /**
             * 6
             * 单个资源的操作
             * url:/sysRoleRelations/operation
             */
            this.delete('/sysRoles/:id/operation', function (request) {
                return [204, {"Content-Type": "application/json"}];
            });

            /**
             * 多对多
             * url:/sysRoleRelations
             */
            this.post('/sysRoleRelations', function (request) {
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRoleRelation: {
                        id: '111',
                        objectId: '222',
                        sysUser: {
                            id: 'sysRoleRelation'
                        }
                    }
                })];
            });

            /**
             * 多对多的批量新增
             * url:/sysUsers/:id/sysDepts/operation
             */
            this.post('/sysRoleRelations/bulkCreate', function (request) {
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRoleRelations: [
                        {
                            id: 'sysRoleRelations01',
                            name: 'xx'
                        },
                        {
                            id: 'sysRoleRelations02',
                            name: 'xx'
                        }
                    ]
                })];
            });
            store = application.registry.lookup('store:main');
            var User = DS.Model.extend({
                name: DS.attr(),
                age: DS.attr(),
                sysRoles: DS.hasMany('sysRole'),
                sysDepts: DS.hasMany('sysDept')
            });
            var Role = DS.Model.extend({
                name: DS.attr(),
                sysUsers: DS.hasMany('sysUser')
            });
            var Dept = DS.Model.extend({
                name: DS.attr()
            });
            application.registry.register('model:relation', Relation);
            application.registry.register('adapter:relation', RelationAdapter);
            application.registry.register('serializer:relation', RelationSerializer);
            application.registry.register('model:sysUser', User);
            application.registry.register('model:sysDept', Dept);
            application.registry.register('model:sysRole', Role);
        });
    },

    afterEach: function () {
        Ember.run(application, 'destroy');
    }
});
test('post:/sysRoles', function (assert) {
    var role1;
    expect(1);
    Ember.run(function () {
        role1 = store.createRecord('sysRole', {
            name: 'role1'
        });
    });
    andThen(function () {
        store.commit({
            requestData: role1,
            requestType: 'post'
        }).then(function (payload) {
            assert.equal(get(payload, 'id'), '1');
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('post:/sysRoles/bulkCreate', function (assert) {
    var role1, role2;
    expect(2);
    Ember.run(function () {
        role1 = store.createRecord('sysRole', {
            name: 'role1'
        });
        role2 = store.createRecord('sysRole', {
            name: 'role2'
        });
    });
    andThen(function () {
        store.commit({
            requestData: [role1, role2],
            requestType: 'post',
            urlSuffix: 'bulkCreate'
        }).then(function (payload) {
            assert.equal(payload.length, 2);
            assert.equal(get(payload, 'firstObject.id'), '21');
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('delete:/sysRoles/bulkDelete', function (assert) {
    var role1, role2;
    expect(2);
    Ember.run(function () {
        role1 = store.push('sysRole', {id: '1', name: '111'});
        role2 = store.push('sysRole', {id: '2', name: '222'});
        role1.deleteRecord();
        role2.deleteRecord();
        assert.ok(store.getById('sysRole', '1') && store.getById('sysRole', '2'));
    });
    andThen(function () {
        store.commit({
            requestData: [role1, role2],
            requestType: 'delete',
            urlSuffix: 'bulkDelete'
        }).then(function (payload) {
            assert.ok(!store.getById('sysRole', '1') && !store.getById('sysRole', '2'));
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('put:/sysRoles/bulkUpdate', function (assert) {
    var role1, role2;
    expect(2);
    Ember.run(function () {
        role1 = store.push('sysRole', {id: '1', name: '111'});
        role2 = store.push('sysRole', {id: '2', name: '222'});
        role1.set('name', 'jone');
        role2.set('name', 'tom');
        assert.ok(get(role1, 'isDirty'));
    });
    andThen(function () {
        store.commit({
            requestData: [role1, role2],
            requestType: 'put',
            urlSuffix: 'bulkUpdate'
        }).then(function (payload) {
            assert.ok(!get('role1', 'isDirty'));
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('put:/sysRoles/:id/operation', function (assert) {
    var role1, role2;
    expect(2);
    Ember.run(function () {
        role1 = store.push('sysRole', {id: '1', name: '111'});
        role1.set('name', 'jone');
        assert.ok(get(role1, 'isDirty'));
    });
    andThen(function () {
        store.commit({
            requestData: role1,
            requestType: 'put',
            urlSuffix: 'operation'
        }).then(function (payload) {
            assert.ok(!get('role1', 'isDirty'));
        }).catch(function () {
            assert.ok(false);
        });
    });
});


test('delete:/sysRoles/:id/operation', function (assert) {
    var role1, role2;
    expect(2);
    Ember.run(function () {
        role1 = store.push('sysRole', {id: '1', name: '111'});
        role1.deleteRecord();
        assert.ok(get(role1, 'isDirty'));
    });
    andThen(function () {
        store.commit({
            requestData: role1,
            requestType: 'delete',
            urlSuffix: 'operation'
        }).then(function (payload) {
            assert.ok(!store.getById('sysRole', '1'));
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('post:/sysRoleRelations', function (assert) {
    var role, user1, user2;
    expect(1);
    Ember.run(function () {
        user1 = store.createRecord('sysUser', {
            name: 'user1'
        });
        user2 = store.createRecord('sysUser', {
            name: 'user2'
        });
        role = store.push('sysRole', {
            id: '1',
            name: 'role1'
        });
    });
    andThen(function () {
        store.commit({
            type: 'sysUsers',
            owner: role,
            requestData: user1,
            requestType: 'post'
        }).then(function (payload) {
            assert.equal(get(payload, 'id'), '111');
        }).catch(function () {
            assert.ok(false);
        });
    });
});
test('post:/sysRoleRelations/bulkCreate', function (assert) {
    var role, user1, user2;
    expect(1);
    Ember.run(function () {
        user1 = store.createRecord('sysUser', {
            name: 'user1'
        });
        user2 = store.createRecord('sysUser', {
            name: 'user2'
        });
        role = store.push('sysRole', {
            id: '1',
            name: 'role1'
        });
    });
    andThen(function () {
        store.commit({
            type: 'sysUsers',
            owner: role,
            requestData: [user1, user2],
            requestType: 'post'
        }).then(function (payload) {
            assert.equal(get(payload, 'firstObject.id'), 'sysRoleRelations01');
        }).catch(function () {
            assert.ok(false);
        });
    });
});