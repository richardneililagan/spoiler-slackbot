function error (errorMessage, safeMessage) {
  var err = new Error(errorMessage)
  if (safeMessage) {
    err.__message = safeMessage
  }

  throw err
}

module.exports = error
