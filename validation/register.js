const Validator = require('validator');
const isEmpty = require('./is-empty.js');

function validateRegisterInput(data){
  let errors = {};

  data.firstName = isEmpty(data.firstName) ? '' : data.firstName;

  if(!Validator.isLength(data.firstName, {min: 2, max: 30})){
    if(isEmpty(data.firstName)) {
        errors.firstName = 'Name field is required';
    } else {
        errors.firstName = 'Name must be between 2 and 30 characters';
    }
  }



  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput;
