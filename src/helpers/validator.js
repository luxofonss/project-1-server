import { isEmptyValue } from "./check";

export function emailValidator(email) {
  let regexp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let validate = email.match(regexp);
  return !isEmptyValue(validate);
}

export function phoneNumberValidator(password) {
  let regexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  let validate = password.match(regexp);
  return !isEmptyValue(validate);
}

export function addCategoryValidator(data) {
  if (data.name && data.cate_code) {
    return true;
  } else {
    return false;
  }
}
