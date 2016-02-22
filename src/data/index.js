var Promise = require('bluebird')
var uuid = require('node-uuid')
var assign = require('lodash/assign')

function DaoGenerator (db) {
  var api = {}

  /**
   * Get an entry with ID beginning with or equal to specified id string.
   * Resolves into an array of all matching results.
   */
  api.get = id => {
    // :: failsafe
    if (!id) {
      return Promise.reject('ID parameter required.')
    }

    var idRegex = new RegExp(`^${ id }`)

    return db.findAsync({
      _id: idRegex
    })
  }

  /**
   * Create a new entry in the spoiler DB
   *
   * :: Expected object should include the following keys:
   *     team_id          - Slack team ID where this was posted
   *     channel_id       - Slack channel ID where this was posted
   *     user_id          - Slack user ID of creator
   *     user_name        - Human readable name of creator
   *     spoiler_about    - (Optional) What is this spoiler about
   *     spoiler_text     - Formal spoiler text
   */
  api.post = item => {
    // :: failsafe
    var validItem = item.team_id &&
      item.channel_id &&
      item.user_id &&
      item.user_name &&
      item.spoiler_text

    if (!validItem) {
      return Promise.reject('Required parameters missing.')
    }

    var _item = assign({}, item, {
      _id: uuid.v4().split('-').join(''),
      created_at: +(new Date())
    })

    return db.insertAsync(_item)
  }

  // ### debug
  api.size = _ => db.countAsync({})

  return api
}

module.exports = DaoGenerator
