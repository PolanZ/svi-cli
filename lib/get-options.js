const path = require('path')
const existsSync = require('fs').existsSync

/**
 *  Read prompts metadata
 * 
 * @param {Stirng} name
 * @param {String} dir
 * @return {Object} metadata
 */ 

module.exports = (name, dir) => {
  const opts = getMetadata(dir)

  setDefault(opts, 'name', name)
  return opts
}

/**
 * Gets the metadata from meta.js
 * 
 * @param {String} dir
 * @return {Object}
 */

function getMetadata (dir) {
  const file = path.join(dir, 'meta.js')
  let opts = {}

  if (!existsSync(file)) {
    throw new Error('meta.js is not exists.')
  } else {
    const req = require(path.resolve(file))
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }

  return opts
}

/**
 * Sets the prompts default
 * 
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */

function setDefault (opts, key, val) {
  const prompts = opts.prompts || (opts.prompts = {})

  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': val
    }
  } else {
    prompts[key]['default'] = val
  }
}