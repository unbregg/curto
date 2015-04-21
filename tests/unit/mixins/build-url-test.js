import Ember from 'ember';
import BuildUrlMixin from '../../../mixins/build-url';
import { module, test } from 'qunit';

module('BuildUrlMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var BuildUrlObject = Ember.Object.extend(BuildUrlMixin);
  var subject = BuildUrlObject.create();
  assert.ok(subject);
});
