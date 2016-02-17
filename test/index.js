var test = require('tape')
var Promise = require('bluebird')

// :: begin tests
test('eslint', require('tape-eslint')({
  files: ['src/**/*.js']
}))

test('db should have promise functions', (t) => {
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
