const async = require('async')
const inquirer = require('inquirer')

// Support types from prompt-for which was used before
const promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

/**
 * Talk question, return result
 * 
 * @param {Obejct} prompts 
 * @param {Obejct} data 
 * @param {Function} done 
 */

module.exports = (prompts, data, done) => {
  console.log('==== initial configuration ====')
  async.eachSeries(Object.keys(prompts), (key, next) => {
    prompt(data, key, prompts[key], next)
  }, done)
}

/**
 * Inquirer prompt wrapper
 * 
 * @param {Object} data 
 * @param {String} key 
 * @param {Obejct} prompt 
 * @param {Function} done 
 */

function prompt (data, key, prompt, done) {
  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || key,
    default: prompt.default
  }]).then(answers => {
    if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  }).catch(done)
}