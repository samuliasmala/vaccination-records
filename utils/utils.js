// Return object with fields that exist in both oldObj and newObj and are
// which values are different between newObj and oldObj
function getChangedFields(fields, newObj, oldObj) {
  let result = {};
  for (const field of fields) {
    if (field in newObj && field in oldObj && newObj[field] !== oldObj[field]) {
      result[field] = newObj[field];
    }
  }
  return result;
}

module.exports = {
  getChangedFields
};
