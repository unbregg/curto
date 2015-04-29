import Ember from "ember";
import { module, test } from 'qunit';
import PersistedAdapter from 'curto/adapters/persisted';
import startApp from '../../helpers/start-app';
var App, store;

module('An Integration test', {
  beforeEach: function () {
    App = startApp();
    store = App.__container__.lookup('store:main');
    var User = DS.Model.extend({
      name: DS.attr(),
      age: DS.attr()
    });

    var UserAdapter = PersistedAdapter.extend();
    App.__container__.register('model:userModel', User);
    App.__container__.register('adapter:userModel', UserAdapter);
  },
  afterEach: function () {
    Ember.run(App, App.destroy);
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
    store.bulkCreate([user1, user2, user3]).then(function (users) {
      //user.get('123');
      //user.get('123');
      //user.get('123222');
      assert.ok(true);
    }).catch(function (e) {
      assert.ok(false);
    });

    assert.equal(user1.get('isLoaded'), true);
    assert.equal(user1.get('isDirty'), false, 'The Record With BulkCreate Status Must Not Be Dirty');

  });

});


test("bulk update", function (assert) {
  assert.expect(4);
  var user1, user2;

  Ember.run(function () {
    user1 = store.push('userModel', {id: '1', name: '111'});
    user2 = store.push('userModel', {id: '2', name: '222'});
  });

  andThen(function () {
    store.bulkUpdate([user1, user2]).then(function (users) {
      //user.get('123');
      //user.get('123');
      //user.get('123222');
      assert.ok(true);
    }).catch(function (e) {
      console.error(e);
      assert.ok(false);
    });

    assert.equal(user1.get('isLoaded'), true);
    assert.equal(user1.get('isDirty'), false, 'The Record With bulkUpdate Status Must Not Be Dirty');
    assert.equal(user1.get('name'),'processed');

  });

});
