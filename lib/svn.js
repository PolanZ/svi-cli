const Client = require('svn-spawn')

module.exports = function SVN(cwd, username, password) {
  var client = new Client({
    cwd: cwd, // path to your svn working directory
    username: username, // optional if authentication not required or is already saved
    password: password, // optional if authentication not required or is already saved
    noAuthCache: true, // optional, if true, username does not become the logged in user on the machine
  })

  client.checkout()
}