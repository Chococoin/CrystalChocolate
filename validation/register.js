const Validator = require('validator');
const isEmpty = require('./is-empty.js');

function validateRegisterInput(data){
  let errors = {};

  data.firstName = isEmpty(data.firstName) ? '' : data.firstName;
  data.lastName  = isEmpty(data.lastName)  ? '' : data.lastName;
  data.country   = isEmpty(data.country)   ? '' : data.country;
  data.email     = isEmpty(data.email)     ? '' : data.email;
  data.pass      = isEmpty(data.pass)      ? '' : data.pass;
  data.pass2     = isEmpty(data.pass2)     ? '' : data.pass2;

  if(!Validator.isLength(data.firstName, {min: 2, max: 30})){
    if(isEmpty(data.firstName)) {
        errors.firstName = 'Firstname field is required.';
    } else {
        errors.firstName = 'Firstname must be between 2 and 30 characters.';
    }
  }

  if(!Validator.isLength(data.lastName, {min: 2, max: 30})){
    if(isEmpty(data.lastName)) {
        errors.lastName = 'Lastname field is required.';
    } else {
        errors.lastName = 'Lastname must be between 2 and 30 characters.';
    }
  }

  if(!Validator.isLength(data.country, {min: 2, max: 30})){
    if(isEmpty(data.country)) {
        errors.country = 'Country field is required.';
    } else {
        errors.country = 'Country must be between 2 and 30 characters.';
    }
  }

  if(!Validator.isLength(data.email, {min: 2, max: 30})){
    if(isEmpty(data.email)) {
        errors.email = 'Email field is required.';
    } else {
        errors.email = 'Email must be between 2 and 30 characters.';
    }
  }

  if(!Validator.isLength(data.pass, {min: 6, max: 28})){
    if(isEmpty(data.pass)) {
        errors.pass = 'Password field is required';
    } else {
        errors.pass = 'Password must be between 2 and 30 characters.';
    }
  }

  if(!Validator.equals(data.pass, data.pass2)){
    errors.passwordMatch = 'Passwords must match.'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput;
