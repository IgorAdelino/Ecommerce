const moongose = require('mongoose')

const validateMongoDBId = (id) => {
  const isValid = moongose.isValidObjectId(id)
  if(!isValid) throw new Error('Invalid Id format')
  return isValid
}
module.exports = validateMongoDBId