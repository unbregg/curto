import Ember from 'ember';
import {
    module,
    test
    } from 'qunit';
import Pretender from 'pretender';
import Relation from 'curto/models/relation';
import startApp from 'curto/tests/helpers/start-app';

var application;
var get = Ember.get;
var store, server;
var rd = {
    id: '1',
    name: 'query'
};
var sysRole = {
        id: '1',
        name: '测试主管'
    },
    sysRole1 = {
        id: '2',
        name: '开发人员'
    },
    sysRoles = [];
sysRoles.push(sysRole);
function getUrlParam(url) {
    var idx = url.indexOf('?'),
        param = url.slice(idx + 1, url.length);
    return JSON.parse(param);
}
function er(request) {
    var requestData = getUrlParam(request.url);
    return (rd.id === requestData.id && rd.name === requestData.name);
}
function p(request) {
    return JSON.parse(request.requestBody);
}
module('Acceptance: XFind', {
    beforeEach: function () {
        application = startApp();
        server = new Pretender(function () {
            /**
             * 1
             * 获取一组资源
             * url: /sysRoles
             */
            this.get('/sysRoles', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({sysRoles: sysRoles})];
            });
            /**
             * 2
             * 获取多对多
             * url:/sysRoleRelations
             */
            this.get('/sysRoleRelations/', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({sysRoleRelations: [
                    {
                        id: '111',
                        objectId: '222',
                        sysRole: sysRole1
                    }
                ]})];
            });

            /**
             * 3
             * 获取单个资源
             * url:/sysRoles/:id
             */
            this.get('/sysRoles/:id', function (request) {
                var params = request.params;
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRole: {
                        id: params.id,
                        name: '次而测'
                    }
                })];
            });

            /**
             * 4
             * 资源组的操作
             * url:/sysRoles/operation
             */
            this.get('/sysRoles/operation', function (request) {
                var sysRole = {
                    id: 'operation',
                    name: 'operation'
                };
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRoles: [sysRole]
                })];
            });

            /**
             * 5
             * 单个资源的操作
             * url:/sysRoles/:id/operation
             */
            this.get('/sysRoles/:id/operation', function (request) {
                var params = request.params;
                var sysRole = {
                    id: params.id,
                    name: 'operation'
                };
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRole: sysRole
                })];
            });

            /**
             * 6
             * 多对多关系的操作
             * url:/sysRoleRelations/operation
             */
            this.get('/sysRoleRelations/operation', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({sysRoleRelations: [
                    {
                        id: '111',
                        objectId: '222',
                        sysRole: {
                            id: 'sysRoleRelation'
                        }
                    }
                ]})];
            });

            /**
             * 一对多
             * url:/sysUsers/:id/sysDepts
             */
            this.get('/sysUsers/:id/sysDepts', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysDepts: [
                        {
                            id: 'sysDept01',
                            name: '部门1'
                        }
                    ]
                })];
            });

            /**
             * 一对多的操作
             * url:/sysUsers/:id/sysDepts/operation
             */
            this.get('/sysUsers/:id/sysDepts/operation', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysDepts: [
                        {
                            id: 'sysDept01operation',
                            name: '部门1'
                        }
                    ]
                })];
            });

            this.get('/sysRoles/count', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    count: 12
                })];
            });

            this.get('/sysRoles/isExists', function (request) {
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    isExists: true
                })];
            });

            this.get('/sysRoles/findOne', function (request) {
                var params = request.params;
                var sysRole = {
                    id: 'findOne',
                    name: 'findOne'
                };
                if (!er(request)) {
                    return [400, {"Content-Type": "application/json"}]
                }
                return [200, {"Content-Type": "application/json"}, JSON.stringify({
                    sysRole: sysRole
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
            application.registry.register('model:sysUser', User);
            application.registry.register('model:sysDept', Dept);
            application.registry.register('model:sysRole', Role);
        });
    },

    afterEach: function () {
        Ember.run(application, 'destroy');
        server.shutdown();
    }
});


test('/sysRoles', function (assert) {
    expect(1);

    andThen(function () {
        store.xFind({
            type: 'sysRole',
            requestData: rd
        }).then(function (payload) {
            assert.equal(get(payload, 'length'), get(sysRoles, 'length'));
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoleRelations', function (assert) {
    expect(2);
    var sysUser;
    Ember.run(function () {
        sysUser = store.createRecord('sysUser', {
            id: 'sysUser01',
            name: '用户01',
            requestData: rd
        });
    });
    andThen(function () {
        store.xFind({
            owner: sysUser,
            type: 'sysRoles',
            requestData: rd
        }).then(function (payload) {
            assert.equal(get(payload, 'length'), 1, 'payload\'s length should be 2');
            assert.equal(get(payload, 'firstObject.id'), '2', 'first record\'s id should be 2');
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/:id', function (assert) {
    expect(1);

    andThen(function () {
        var id = '222';
        store.xFind({
            type: 'sysRole',
            recordId: id,
            requestData: rd
        }).then(function (payload) {
            assert.equal(get(payload, 'id'), id);
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/operation', function (assert) {
    expect(1);

    andThen(function () {
        store.xFind({
            type: 'sysRole',
            urlSuffix: 'operation',
            requestData: rd
        }).then(function (payload) {
            assert.equal(get(payload, 'firstObject.name'), 'operation');
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/:id/operation', function (assert) {
    expect(2);

    andThen(function () {
        var id = '111',
            operation = 'operation';
        store.xFind({
            type: 'sysRole',
            recordId: id,
            urlSuffix: operation,
            requestData: rd
        }).then(function (payload) {
            assert.equal(get(payload, 'id'), id);
            assert.equal(get(payload, 'name'), operation);
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoleRelations/operation', function (assert) {
    expect(2);

    andThen(function () {
        var id = '111',
            operation = 'operation';
        store.xFind({
            type: 'sysRole',
            recordId: id,
            urlSuffix: operation,
            requestData: rd
        }).then(function (payload) {
            assert.equal(get(payload, 'id'), id);
            assert.equal(get(payload, 'name'), operation);
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/:id/sysDepts', function (assert) {
    expect(1);
    var sysUser;
    Ember.run(function () {
        sysUser = store.createRecord('sysUser', {
            id: 'sysUser01',
            name: '用户01'
        });
    });
    andThen(function () {
        store.xFind({
            owner: sysUser,
            type: 'sysDepts',
            requestData: rd
        }).then(function (payload) {
            assert.ok(get(payload, 'firstObject.id'), 'sysDept01');
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/:id/sysDepts/operation', function (assert) {
    expect(1);
    var sysUser;
    Ember.run(function () {
        sysUser = store.createRecord('sysUser', {
            id: 'sysUser01',
            name: '用户01'
        });
    });
    andThen(function () {
        store.xFind({
            owner: sysUser,
            type: 'sysDepts',
            requestData: rd,
            urlSuffix: 'operation'
        }).then(function (payload) {
            assert.ok(get(payload, 'firstObject.id'), 'sysDept01operation');
        }).catch(function () {
            assert.ok(false);
        });
    });
});


test('/sysRoles/count', function (assert) {
    expect(1);
    andThen(function () {
        store.xFind({
            type: 'sysRole',
            requestData: rd,
            urlSuffix: 'count',
            payloadType: 'object'
        }).then(function (payload) {
            assert.ok(get(payload, 'count'), 12);
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/isExists', function (assert) {
    expect(1);
    andThen(function () {
        store.xFind({
            type: 'sysRole',
            requestData: rd,
            urlSuffix: 'isExists',
            payloadType: 'object'
        }).then(function (payload) {
            assert.ok(get(payload, 'isExists'), true);
        }).catch(function () {
            assert.ok(false);
        });
    });
});

test('/sysRoles/findOne', function (assert) {
    expect(1);
    andThen(function () {
        store.xFind({
            type: 'sysRole',
            requestData: rd,
            urlSuffix: 'findOne',
            payloadType: 'object'
        }).then(function (payload) {
            assert.equal(get(payload, 'name'), 'findOne');
        }).catch(function () {
            assert.ok(false);
        });
    });
});