const Datastore = require('nedb')
const Promise = require('./promise')

/**
 * Creates / Opens the datastore at the specified file path.
 * If [filepath] is null / empty, an in-memory datastore is provisioned instead.
 * @param  {String}      filepath Location where datastore is persisted in the file system.
 * @return {Datastore}   the Datastore instance
 */
module.exports = function (filepath) {
  var db = filepath
    ? new Datastore({ filename: filepath, autoload: true })
    : new Datastore()

  return Promise.promisifyAll(db)
}
