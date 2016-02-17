function DaoGenerator (db) {
  var api = {}

  // :: TODO

  // ### debug
  api.size = () => db.count({})

  return api
}

module.exports = DaoGenerator
