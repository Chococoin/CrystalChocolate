const Validator = require('validator');
const isEmpty = require('./is-empty.js');

function validateRegisterInput(data){
  let errors = {};
  if(!Validator.isLength(data.firstName, {min: 2, max: 30})){
    errors.firstName = 'Name must be between 2 and 30 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput;
