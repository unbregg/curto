import {
  moduleFor,
  test
  } from 'ember-qunit';
import DS from 'ember-data';

var adapter, id, type, snapshot;
var CONST_ID = '1';
moduleFor('adapter:persisted', 'PersistedAdapter', {
  setup: function () {
    var store = this.container.lookup('store:main'), User;

    User = DS.Model.extend({
      name: DS.attr(),
      age: DS.attr()
    });

    this.container.register('model:userModel', User);
    snapshot = store.push('userModel', {id: '1', name: 'adapterTester'})._createSnapshot();
    type = 'userModel';
    adapter = this.subject();
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
  var resourceOperationURL = adapter.buildURL(type, null, null, 'recordOperation', 'findOne');
  assert.equal(resourceOperationURL, "/userModels/findOne");
});

test('build recordOperation', function (assert) {
  var recordOperationURL = adapter.buildURL(type, CONST_ID, snapshot,'recordOperation','updateHasRead');
  assert.equal(recordOperationURL, `/userModels/${CONST_ID}/updateHasRead`);
});
