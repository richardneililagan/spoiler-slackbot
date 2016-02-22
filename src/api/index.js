var each = require('lodash/each')

var enabledCommands = [
  // 'help'
]

var api = {}

each(enabledCommands, command => {
  api[command] = require(`./${ command }`)
})

module.exports = api
