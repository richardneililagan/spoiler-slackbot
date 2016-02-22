/**
 *  Initializes server
 */
var koa = require('koa')
var app = koa()

var compact = require('lodash/compact')

var router = require('koa-router')()

var api = require('./api')
var config = require('./config')
var error = require('./error')

app.use(require('koa-bodyparser')())

// :: error handler
app.use(function* (next) {
  try {
    yield next
  } catch (err) {
    this.status = err.status || 500
    this.type = 'text'
    this.body = err.message

    this.app.emit('error', err, this)

    console.log(err.__message || 'Something blew up.')
  }
})

//  A Slack POST request will provide the following parameters
//  - token
//  - team_id
//  - team_domain
//  - channel_id
//  - channel_name
//  - user_id
//  - user_name
//  - command
//  - text
//  - response_url
router.post('/', function* () {
  var body = this.request.body

  var commandString = compact(body.text.split(' '))
  var targetFunction = (commandString[0] || '').toLowerCase()

  console.log(api[targetFunction])

  // :: check if this request is from a valid Slack group
  if (!~config.allowedTokens.indexOf(body.token)) {
    error('Verification token not allowed.', 'Your Slack group is not allowed to talk to this bot.')
  }

  // :: mediate which function to call
  if (!api[targetFunction]) {
    this.response.body = 'That function is not supported. Try `' + body.command + ' help` for more information.'
  } else {
    this.response.body = api[targetFunction](body)
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

// :: start the server
app.listen(config.port)
