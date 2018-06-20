const match = require('minimatch')

/**
 * filter from meta.js
 * 
 * @param {String} files 
 * @param {Object} filters 
 * @param {Object} data 
 * @param {Function} done 
 */
module.exports = (files, filters, data, done) => {
  if (!filters) return done()

  const fileNames = Object.keys(files)
  fileNames.forEach(file => {
    Object.keys(filters).forEach(key => {
      if (!data[key]) {
        const filterName = filters[key]
        if (typeof filterName === 'object') {
          Object.keys(filterName).forEach(glob => {
            const rmObj = filterName[glob]
            if (rmObj && match(file, rmObj, { dot: true })) {
              delete files[file]
            }
          })
        } else {
          if (filterName && match(file, filterName, { dot: true })) {
            delete files[file]
          }
        }
      }
    })
  })
  done()
}