import Ember from 'ember';
import { initialize } from '../../../initializers/app-ext';
import { module, test } from 'qunit';

var container, application;

var store;
module('AppExtInitializer', {
  beforeEach: function () {
    Ember.run(function () {
      application = Ember.Application.create();
      container = application.registry;
      application.deferReadiness();
      initialize(container, application);

      var User = DS.Model.extend({
        name: DS.attr(),
        age: DS.attr()
      });
      container.register('model:userModel', User);
    });
  }
});

test('to loaded.uncommitted when modify record and invoke beSaved to saved status', function (assert) {
  store = container.lookup('store:main');
  var user = null;

  Ember.run(function () {
    user = store.push('userModel', {id: 'some_key', name: '123', age: '222'});
  });

  assert.equal(user.get('currentState.stateName'), 'root.loaded.saved');
  Ember.run(function () {
    user.set('name', 'Another Name');
  });

  assert.equal(user.get('currentState.stateName'), 'root.loaded.updated.uncommitted');
  Ember.run(function () {
    user.beSaved();
  });
  assert.equal(user.get('currentState.stateName'), 'root.loaded.saved');
  assert.equal(user.get('name'), 'Another Name');
});
