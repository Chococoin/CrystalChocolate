const Validator = require('validator');
const isEmpty = require('./is-empty.js');

function validateLoginInput(data){
  let errors = {};

  data.user = isEmpty(data.user) ? '' : data.user;
  data.pass = isEmpty(data.pass) ? '' : data.pass;

  if(!Validator.isLength(data.user, {min: 2, max: 30})){
    if(isEmpty(data.user)) {
        errors.user = 'User field is required.';
    } else {
        errors.user = 'User must be between 2 and 30 characters.';
    }
  }

  if(!Validator.isLength(data.pass, {min: 6, max: 28})){
    if(isEmpty(data.pass)) {
        errors.pass = 'Password field is required';
    } else {
        errors.pass = 'Password must be between 2 and 30 characters.';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateLoginInput;