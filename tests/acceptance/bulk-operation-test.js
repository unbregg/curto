import Ember from "ember";
import { module, test } from 'qunit';
import PersistedAdapter from 'curto/adapters/persisted';
import startApp from 'curto/tests/helpers/start-app';
import Pretender from 'pretender';
var App, store, server;

function p(request) {
  return JSON.parse(request.requestBody);
}

module('An Integration test', {
  beforeEach: function () {
    App = startApp();
    server = new Pretender(function () {
      this.post('/userModels/bulkCreate', function (request) {
        return [200, {"Content-Type": "application/json"}, JSON.stringify({userModels: p(request)})];
      });
      this.put('/userModels/bulkUpdate', function (request) {
        var requestBody = p(request);
        requestBody.forEach(function (userModel) {
          userModel.name = 'processed';
        });
        return [200, {"Content-Type": "application/json"}, JSON.stringify({userModels: requestBody})];
      });
      this.delete('/userModels/bulkDelete', function (/*request*/) {
        return [204, {"Content-Type": "application/json"}];
      });
    });

    store = App.registry.lookup('store:main');
    var User = DS.Model.extend({
      name: DS.attr(),
      age: DS.attr()
    });

    var UserAdapter = PersistedAdapter.extend();
    App.registry.register('model:userModel', User);
    App.registry.register('adapter:userModel', UserAdapter);
  },
  afterEach: function () {
    Ember.run(App, App.destroy);
    server.shutdown();
  }
});

test("bulk create", function (assert) {
  assert.expect(3);
  var user1, user2, user3;

  Ember.run(function () {
    user1 = store.createRecord('userModel', {id: '1', name: '111'});
    user2 = store.createRecord('userModel', {id: '2', name: '222'});
    user3 = store.createRecord('userModel', {id: '3', name: '333'});
  });

  andThen(function () {
    store.bulkCreate([user1, user2, user3]).then(function (/*users*/) {
      assert.ok(false);
    }).catch(function () {
      assert.ok(false);
    });

    assert.equal(user1.get('isLoaded'), true);
    assert.equal(user1.get('isDirty'), false);

  });

});


test("bulk update", function (assert) {
  assert.expect(4);
  var user1, user2;

  Ember.run(function () {
    user1 = store.push('userModel', {id: '1', name: '111'});
    user2 = store.push('userModel', {id: '2', name: '222'});
    user1.set('name', 'jone');
    user2.set('name', 'tom');
  });

  andThen(function () {
    store.bulkUpdate([user1, user2]).then(function (/*users*/) {
      assert.ok(true);
      assert.equal(user1.get('isLoaded'), true);
      assert.equal(user1.get('isDirty'), false);
      assert.equal(user1.get('name'), 'processed');
    }).catch(function (e) {
      console.error(e);
      assert.ok(false);
    });
  });
});


test("bulk delete", function (assert) {
  assert.expect(1);
  var user1, user2;

  Ember.run(function () {
    user1 = store.push('userModel', {id: '1', name: '111'});
    user2 = store.push('userModel', {id: '2', name: '222'});
    user1.set('name', 'jone');
    user2.set('name', 'tom');
  });

  andThen(function () {
    store.bulkDelete([user1, user2]).then(function (/*users*/) {
      assert.ok(true);
    });
  });
});
