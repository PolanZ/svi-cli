const inquirer = require('inquirer')
const logger = require('./logger')

module.exports = function getUser(done) {
  console.log('Please input the svn identity');

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
        done(answers)
      }
    }).catch(logger.fatal)

  
}