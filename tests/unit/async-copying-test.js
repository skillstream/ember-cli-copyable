import Ember from 'ember';
// import { test } from 'ember-qunit';
import { module, skip, test } from 'qunit';
import startApp from '../helpers/start-app';
import fabricate from '../helpers/fabricate';

var store;

module('async copying', {
  beforeEach: function() {
    store = fabricate(startApp(), true);
  }
});

test('it overwrites attributes', function(assert) {
  assert.expect(1);

  return Ember.run(function() {
    return store.peekRecord('foo', '1').copy({property: 'custom'}).then(function (copy) {
      assert.equal(copy.get('property'), 'custom');
    });
  });
});

test('it shallow copies relation', function(assert) {
  assert.expect(1);

  return Ember.run(function() {
    const fooBar = store.peekRecord('foo-bar', '1');

    return fooBar.copy().then(function (copy) {
      assert.equal(copy.get('fooFix.id'), '1');
    });
  });
});

test('it copies belongsTo relation', function(assert) {
  assert.expect(2);

  return Ember.run(function() {
    const bar = store.peekRecord('bar', '1');

    return bar.copy().then(function (copy) {
      assert.notEqual(copy.get('foo.id'), bar.get('foo.id'));
      assert.equal(copy.get('foo.property'), 'prop1');
    });
  });
});

test('it copies with empty belongsTo relation', function(assert) {
  assert.expect(2);

  return Ember.run(function() {
    const fooEmpty = store.peekRecord('fooEmpty', '1')

    return fooEmpty.copy().then(function (copy) {
      assert.equal(copy.get('property'), fooEmpty.get('property'));
      return copy.get('foo').then(function(foo) {
        assert.equal(foo, null);
      });
    });
  });
});

test('it copies hasMany relation', function(assert) {
  assert.expect(5);

  return Ember.run(function() {
    const baz = store.peekRecord('baz', '1');

    return baz.copy().then(function (copy) {
      assert.equal(copy.get('foos.length'), 2);
      assert.notEqual(copy.get('foos.firstObject.id'), '1');
      assert.notEqual(copy.get('foos.lastObject.id'), '2');
      assert.equal(copy.get('foos.firstObject.property'), 'prop1');
      assert.equal(copy.get('foos.lastObject.property'), 'prop2');
    });
  });
});

test('it copies complex objects', function(assert) {
  assert.expect(6);

  return Ember.run(function() {
    const multi = store.peekRecord('multi', '1');

    return multi.copy().then(function (copy) {
      assert.notEqual(copy.get('bars.firstObject.id'), '1');
      assert.notEqual(copy.get('bars.firstObject.foo.id'), '1');
      assert.equal(copy.get('bars.firstObject.foo.property'), 'prop1');
      assert.notEqual(copy.get('baz.id'), '1');
      assert.notEqual(copy.get('baz.foos.lastObject.id'), '2');
      assert.equal(copy.get('baz.foos.lastObject.property'), 'prop2');
    });
  });
});

test('it copies objects with nested hasMany', function(assert) {
  assert.expect(1);

  return Ember.run(function() {
    const nested = store.peekRecord('nestedList', '1');

    return nested.copy().then(function (copy) {
      assert.equal(copy.get('baz.firstObject.foos.firstObject.property'), 'prop1');
    });
  });
});

test('it overwrites relations', function(assert) {
  assert.expect(2);

  return Ember.run(function() {
    const myBaz = store.peekRecord('baz', '2');
    const multi = store.peekRecord('multi', '1');

    return multi.copy({baz: myBaz, bars: []}).then(function (copy) {
      assert.equal(copy.get('bars.length'), 0);
      assert.equal(copy.get('baz.foos.length'), 1);
    });
  });
});

skip('it passes options to relations', function(assert) {
  assert.expect(2);

  return Ember.run(function() {
    const multi = store.peekRecord('multi', '1');

    return multi.copy({baz: {bar: {foo: {property: 'asdf'}}}}).then(function (copy) {
      assert.equal(copy.get('bars.firstObject.foo.property'), 'prop1');
      assert.equal(copy.get('baz.bar.foo.property'), 'asdf');
    });
  });
});

test('it copies empty objects', function(assert) {
  assert.expect(3);

  return Ember.run(function() {
    const multi = store.peekRecord('multi', '2');

    return multi.copy().then(function (copy) {
      assert.notEqual(copy.get('id'), '2');
      assert.equal(copy.get('bars.length'), 0);
      assert.equal(copy.get('baz.foos.firstObject.property'), 'prop1');
    });
  });
});
