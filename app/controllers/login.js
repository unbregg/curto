import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

var set = Ember.set;
var get = Ember.get;
export default
Ember.Controller.extend(LoginControllerMixin,{
  identification:null,
  password:null,
  authenticator: 'authenticator:token',
  isValid: Ember.computed.empty('errors.[]'),
  isAuthenticating: false,
  errorMessage: function () {
    var errors = this.get('errors');
    var message = [];
    if (Ember.isPresent(errors)) {
      errors.forEach(function (item) {
        message.push(item);
      });
    }
    return message.join('<br/>');
  }.property('errors.@each'),
  init:function(){
    set(this, 'errors', Ember.A());
    var credentials = this.get('credentials');
    for (var attr in credentials) {
      this.addObserver(attr, this, this._validate);
    }
  },
  _validate:function(){
    this.errors.clear();
    this.call();
    if (get(this, 'isValid')) {
      return Ember.RSVP.resolve(true);
    } else {
      return Ember.RSVP.resolve(false);
    }
  },
  call: function() {
    if (Ember.isEmpty(get(this, 'identification'))) {
      this.errors.pushObject('Username must not be blank');
    }
    if (Ember.isEmpty(get(this, 'password'))) {
      this.errors.pushObject('Password must not be blank');
    }
  },
  validate: function() {
    var self = this;
    return this._validate().then(function(success) {
      // Convert validation failures to rejects.
      var errors = get(self, 'errors');
      if (success) {
        return errors;
      } else {
        return Ember.RSVP.reject(errors);
      }
    });
  },
  actions: {
    login: function () {
      var self = this;
      self.set('isAuthenticating',true);
      this.validate().then(function(){
        //TODO stop use private property ：_actions
        return self._actions['authenticate'].apply(self).catch(function(reason){
          self.errors.clear();
          self.errors.pushObject(reason.error.message);
        });
      }).finally(function(){
        self.set('isAuthenticating',false);
      });
    }
  }
});
