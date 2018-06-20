const path = require('path')
const home = require('user-home')
const fs = require('fs')
const rm = require('rimraf').sync
const inquirer = require('inquirer')
const logger = require('./logger')

let src = '.svn-user'
src = path.join(home, src)

module.exports = function getUser(done) {
  console.log('=== Please input the svn identity === ');

  if (fs.existsSync(src)) {
    let user = fs.readFileSync(src, {encoding: 'utf-8'})
    if (user === '[object Object]') {
      talk(done)
    } else if (typeof user === 'string') {
      user = JSON.parse(user)
      done(user)
    } else {
      talk(done)
    }
  } else {
    talk(done)
  }
}

function talk (done) {
  inquirer.prompt([{
    type: 'input',
    message: 'username: ',
    name: 'username'
  }, {
    type: 'password',
    mask: '*',
    message: 'password: ',
    name: 'password'
  }]).then(answers => {
    if (answers) {
      if (fs.existsSync(src)) rm(src)

      const str = JSON.stringify(answers)
      fs.writeFileSync(src, str, {encoding: 'utf-8'})
      done(answers)
    }
  }).catch(logger.fatal)
}
