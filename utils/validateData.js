function validatePostData(data) {
    const errors = [];
    const requiredFields = ['NameFirst'];
  
    if (!data.fieldData) {
      errors.push('fieldData is required.');
      return { isValid: false, errors };
    }
  
    requiredFields.forEach((field) => {
      if (!data.fieldData[field]) {
        errors.push(`${field} is required.`);
      }
    });
  
    return { isValid: errors.length === 0, errors };
  }
  
  module.exports = { validatePostData };
  