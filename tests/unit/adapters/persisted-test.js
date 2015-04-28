/* jshint undef: true, unused: false */
import {
  moduleFor,
  test
  } from 'ember-qunit';
import DS from 'ember-data';

var adapter, id, typeName, snapshot, type, store;
var CONST_ID = '1';

function mockAjax(url, type, data) {
  return {
    url: url,
    data: data
  };
}

moduleFor('adapter:persisted', 'PersistedAdapter', {
  setup: function () {
    var User;
    store = this.container.lookup('store:main');

    User = DS.Model.extend({
      name: DS.attr(),
      age: DS.attr()
    });

    this.container.register('model:userModel', User);
    snapshot = store.push('userModel', {id: '1', name: 'adapterTester'})._createSnapshot();
    typeName = 'userModel';
    type = store.modelFor(typeName);
    adapter = this.subject();
    adapter.ajax = mockAjax;
  },
  // Specify the other units that are required for this test.
  needs: ['store:main']
});

// Replace this with your real tests.
test('it exists', function (assert) {
  assert.ok(adapter);
});

test('build findAll', function (assert) {
  assert.ok(true);
});

test('build findQuery', function (assert) {
  assert.ok(true);
});

test('build findMany', function (assert) {
  assert.ok(true);
});

test('build findHasMany', function (assert) {
  assert.ok(true);
});

test('build findBelongsTo', function (assert) {
  assert.ok(true);
});

test('build deleteRecord', function (assert) {
  assert.ok(true);
});

test('build resourceOperation', function (assert) {
  var resourceOperationURL = adapter.buildURL(typeName, null, null, 'recordOperation', 'findOne');
  assert.equal(resourceOperationURL, "/userModels/findOne");
});

test('build recordOperation', function (assert) {
  var recordOperationURL = adapter.buildURL(typeName, CONST_ID, snapshot, 'recordOperation', 'updateHasRead');
  assert.equal(recordOperationURL, `/userModels/${CONST_ID}/updateHasRead`);
});

test('count url building with query', function (assert) {
  assert.expect(2);
  var request = adapter.count(store, type, {name: 'zhangsan'});
  assert.equal(request.url, '/userModels/count');
  assert.deepEqual(request.data, {data: {name: 'zhangsan'}});
});

test('isExist url building', function (assert) {
  assert.expect(1);
  var request = adapter.isExists(store, type, 1);
  assert.equal(request.url, '/userModels/1/exists');
});

