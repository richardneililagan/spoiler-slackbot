var config = {}

// :: application port (default: 3000)
config.port = process.env.SPOILERSLACKBOT_PORT || 9000

// :: allowed Slack verification tokens
//    https://api.slack.com/slash-commands#validating_the_command
//
//    Tokens are semi-colon delimited.
config.allowedTokens =
  (process.env.SPOILERSLACKBOT_SLACKVERIFICATIONTOKENS || '').split(';')

module.exports = config
