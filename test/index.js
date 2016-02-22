var test = require('tape')
var Promise = require('bluebird')

var map = require('lodash/map')
var random = require('lodash/random')
var uniqueid = require('lodash/uniqueId')
var pick = require('lodash/pick')
var without = require('lodash/without')
var isArray = require('lodash/isArray')

// :: begin tests
test('eslint', require('tape-eslint')({
  files: ['src/**/*.js']
}))

test('db should have working promise functionality', t => {
  var datastore = require('../src/db')
  var db = datastore()

  var countTask = db.countAsync({})
    .catch(_ => {
      t.fail('Unexpected .catch clause reached.')
    })
    .then(_ => {
      t.pass('Promise .then chain reached.')
      throw new Error('Forced error')
    })
    .catch(_ => {
      t.pass('Promise .catch chain reached.')
    })
    .finally(_ => {
      t.end()
    })

  t.ok(countTask instanceof Promise, 'db returns Promise objects')
})

test('dao should have correct sizing functionality', t => {
  var datastore = require('../src/db')
  var db = datastore()
  var dao = require('../src/data')(db)

  var items = map(Array(random(1, 10)), _ => {
    return {
      test: uniqueid()
    }
  })

  dao.size()
    .then(result => {
      t.equal(result, 0, 'Initial empty size confirmed.')
    })
    .then(_ => {
      return db.insertAsync(items)
    })
    .then(_ => {
      return dao.size()
    })
    .then(result => {
      t.equal(result, items.length, `Modified size of ${ items.length } confirmed correct.`)
    })
    .finally(_ => {
      t.end()
    })
})

test('dao should require specific properties on insert', t => {
  var datastore = require('../src/db')
  var dao = require('../src/data')(datastore())

  var validitem = {
    team_id: 'foo',
    channel_id: 'bar',
    user_id: 'test',
    user_name: 'herp',
    spoiler_text: 'derp'
  }

  var requiredkeys = map(validitem, (i, k) => k)

  dao
    .size()
    .then(result => {
      t.equal(result, 0, 'Initial empty size confirmed')
    })
    .then(_ => {
      return Promise.any(map(requiredkeys, key => {

        var targetkeys = without(requiredkeys, key)
        var targetitem = pick(validitem, targetkeys)

        return dao.post(targetitem)
          .then(_ => {
            t.fail(`${ key } failed mandatory check on insert.`)
          })
      }))
    })
    .then(_ => {
      t.fail('Some inserts succeeded unexpectedly.')
    })
    .catch(_ => {
      t.pass('All inserts failed mandatory requirements as expected.')
    })
    .finally(_ => {
      t.end()
    })
})

test('dao should be able to insert and retrieve correctly', t => {
  var datastore = require('../src/db')
  var dao = require('../src/data')(datastore())

  dao
    .post({
      team_id: 'foo',
      channel_id: 'bar',
      user_id: 'test',
      user_name: 'herp',
      spoiler_text: 'derp'
    })
    .then(item => {
      var targetid = item._id
      var querylength = random(5, 10)
      var query = targetid.split('').splice(0, querylength).join('')

      return dao.get(query)
    })
    .then(results => {
      t.ok(isArray(results), 'Result set is an array.')
      t.equals(results.length, 1, `Expected result retrieved from db.`)
    })
    .catch(_ => {
      t.fail('Something went wrong.')
    })
    .finally(_ => {
      t.end()
    })
})
