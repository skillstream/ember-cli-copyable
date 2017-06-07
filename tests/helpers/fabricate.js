import DS from 'ember-data';
import Ember from 'ember';
import Copyable from 'ember-cli-copyable';

var setupModels = function(app, async) {
  app.Foo = DS.Model.extend( Copyable, {
    property: DS.attr('string')
  });

  app.Bar = DS.Model.extend( Copyable, {
    foo: DS.belongsTo('foo', { async: async })
  });

  app.Baz = DS.Model.extend( Copyable, {
    foos: DS.hasMany('foo', {async: async }),
    bar: DS.belongsTo('bar', {async: async })
  });

  app.NestedList = DS.Model.extend( Copyable, {
    baz: DS.hasMany('baz', {async: async })
  });

  app.Multi = DS.Model.extend( Copyable, {
    bars: DS.hasMany('bar', {async: async }),
    baz: DS.belongsTo('baz', {async: async })
  });

  app.FooFix = DS.Model.extend( {
    property: DS.attr('string')
  });

  app.FooBar = DS.Model.extend( Copyable, {
    fooFix: DS.belongsTo('fooFix', { async: async })
  });

  app.FooEmpty = DS.Model.extend( Copyable, {
    property: DS.attr('string'),
    foo: DS.belongsTo('foo', { async: async })
  });
};

var setupFixtures = function(app, store) {
  let data = [
    {
      id: 1,
      type: 'foo',
      attributes: {
        property: 'prop1'
      },
      relationships: {}
    },
    {
      id: 2,
      type: 'foo',
      attributes: {
        property: 'prop2'
      },
      relationships: {}
    },
    {
      id: 3,
      type: 'foo',
      attributes: {
        property: 'prop3'
      },
      relationships: {}
    },
    {
      id: 1,
      type: 'bar',
      attributes: {},
      relationships: {
        foo: {
          data: { id: 1, type: 'foo' }
        }
      }
    },
    {
      id: 1,
      type: 'baz',
      attributes: {},
      relationships: {
        foos: {
          data: [{ id: 1, type: 'foo' }, { id: 2, type: 'foo' }]
        },
        bar: {
          data: { id: 1, type: 'bar' }
        }
      }
    },
    {
      id: 2,
      type: 'baz',
      attributes: {},
      relationships: {
        foos: {
          data: [{ id: 3, type: 'foo' }]
        },
        bar: {
          data: { id: 1, type: 'bar' }
        }
      }
    },
    {
      id: 1,
      type: 'multi',
      attributes: {},
      relationships: {
        bars: {
          data: [{ id: 1, type: 'bar' }]
        },
        baz: {
          data: { id: 1, type: 'baz' }
        }
      }
    },
    {
      id: 2,
      type: 'multi',
      attributes: {},
      relationships: {
        bars: {
          data: []
        },
        baz: {
          data: { id: 1, type: 'baz' }
        }
      }
    },
    {
      id: 1,
      type: 'nested-list',
      attributes: {},
      relationships: {
        baz: {
          data: [{ id: 1, type: 'baz' }]
        }
      }
    },
    {
      id: 1,
      type: 'foo-fix',
      attributes: {
        property: 'fix1'
      },
      relationships: {}
    },
    {
      id: 1,
      type: 'foo-bar',
      attributes: {},
      relationships: {
        fooFix: {
          data: { id: 1, type: 'foo-fix'}
        }
      }
    },
    {
      id: 1,
      type: 'foo-empty',
      attributes: {
        property: '2'
      },
      relationships: {}
    },
  ]


  app.Foo.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'property': 'prop1'
      },
      {
        'id': '2',
        'property': 'prop2'
      },
      {
        'id': '3',
        'property': 'prop3'
      }
    ]
  });

  app.Bar.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'foo': '1'
      }
    ]
  });

  app.Baz.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'foos': ['1', '2'],
        'bar': '1'
      },
      {
        'id': '2',
        'foos': ['3'],
        'bar': '1'
      }
    ]
  });

  app.Multi.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'bars': ['1'],
        'baz': '1'
      },
      {
        'id': '2',
        'bars': [],
        'baz': '1'
      }
    ]
  });

  app.NestedList.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'baz': ['1']
      },
    ]
  });

  app.FooFix.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'property': 'fix1'
      }
    ]
  });

  app.FooBar.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'fooFix': '1'
      }
    ]
  });

  app.FooEmpty.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'property': '2'
      }
    ]
  });

  Ember.run(() => {
    store.push({ data });
  });

  // Ember.run(() => {
  //   ['Foo', 'Bar', 'Baz', 'NestedList', 'Multi', 'FooFix', 'FooBar', 'FooEmpty'].forEach(className => {
  //     store.push({ data:
  //       app[className].FIXTURES.map(fixture => {
  //         let attributes = JSON.parse(JSON.stringify(fixture));
  //         delete attributes.id;
  //
  //         return {
  //           id: fixture.id,
  //           type: Ember.String.dasherize(className),
  //           attributes,
  //           relationships: {}
  //         }
  //       })
  //     });
  //   });
  // });
};

export default function fabricate(app, async) {
  const store = app.__container__.lookup('service:store');
  // debugger;
  setupModels(app, async);
  setupFixtures(app, store);
  return store;
}
