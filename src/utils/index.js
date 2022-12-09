import bcrypt, { hashSync } from "bcryptjs";
import { isEmptyValue } from "../helpers/check";
import { emailValidator, phoneNumberValidator } from "../helpers/validator";

const salt = bcrypt.genSaltSync(10);
const db = require("../../connectDB");
const promisePool = db.promise();

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleCheckUser = (email, phone_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!phoneNumberValidator(phone_num)) {
        console.log("Phone number wrong");
        resolve(false);
      } else if (!emailValidator(email)) {
        console.log("email wrong");
        resolve(false);
      } else {
        let sql = `SELECT * FROM myshop.user WHERE email = '${email}' || phone_num = '${phone_num}'  LIMIT 1 `;
        let [rows, fields] = await promisePool.query(sql);
        if (isEmptyValue(rows)) {
          resolve(rows);
        } else resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let matchPassword = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT * FROM myshop.user WHERE email = "${email}" `;
      let [rows, fields] = await promisePool.query(sql);
      let user = rows[0];
      let hashPassword = user.password;
      let checkPassword = await bcrypt.compare(password, hashPassword);
      console.log("check: ", checkPassword);
      if (isEmptyValue(rows)) {
        resolve(false);
      } else if (checkPassword === false) {
        resolve(false);
      } else resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCheckUser,
  hashUserPassword,
  matchPassword,
};
