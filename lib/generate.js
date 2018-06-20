const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const path = require('path')
const rm = require('rimraf').sync
const async = require('async')
const multimatch = require('multimatch')
const render = require('consolidate').handlebars.render

const getOptions = require('./get-options')
const talk = require('./talk')
const filter = require('./filter')

// register handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})

/**
 * Generate a template given a `src` and `dest`.
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate(name, src, dest, done) {
  const opts = getOptions(name, src)

  const metalsmith = Metalsmith(path.join(src, 'template'))
  /* const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  }) */
  metalsmith.use(talkQuestion(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles(opts.renderFiles))
  

  metalsmith.clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build((err, files) => {
      done(err)
    })

  // return data
}

/** 
 * Create a middleware from talk question
 * 
 * @param {Object} prompts
 * @return {Function}
*/

function talkQuestion (prompts) {
  return (files, metalsmith, done) => {
    talk(prompts, metalsmith.metadata(), done)
  }
}

/**
 * Create a middleware for filtering some file or folder
 * 
 * @param {Object} filters
 * @return {Function}
*/

function filterFiles (filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

/**
 * Template in place plugin
 */

function renderTemplateFiles (renderFiles) {
  renderFiles = typeof renderFiles === 'string'
    ? [renderFiles]
    : renderFiles
  return (files, metalsmith, done) => {
    const meta = metalsmith.metadata()
    /* Object.keys(files).filter(x => x.includes('package.json')).forEach(fileName => {
      const str = files[fileName].contents.toString()
      files[fileName].contents = new Buffer(Handlebars.compile(str)(meta))
    }) */
    async.each(Object.keys(files), (file, next) => {
      if (renderFiles && !multimatch([file], renderFiles, { dot: true }).length) {
        return next()
      }

      const str = files[file].contents.toString()

      // do not attempt to render files that do not have mustaches
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }

      render(str, metalsmith.metadata(), (err, res) => {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        files[file].contents = new Buffer(res)
        next()
      })
    }, done)
  }
}