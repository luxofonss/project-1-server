import bcrypt from "bcryptjs";
import moment from "moment";

import { handleCheckUser, hashUserPassword } from "../utils/index";

const salt = bcrypt.genSaltSync(10);
const db = require("../../connectDB");
const promisePool = db.promise();

let createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkValidUser = await handleCheckUser(data.email, data.phone_num);
      let createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      if (checkValidUser) {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        let user = {
          email: data.email,
          password: hashPasswordFromBcrypt,
          full_name: data.full_name,
          role: data.role,
          address: data.address,
          phone_num: data.phone_num,
          created_at: createdAt,
        };
        let sql = "INSERT INTO myshop.user SET ?";
        const [rows, fields] = await promisePool.query(sql, [user]);
        resolve(rows);
      } else {
        resolve({
          errCode: 1,
          errMessage: "Please check your email address or phone number",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log(id);
    try {
      let sql = `UPDATE myshop.user SET deleted_at = ? WHERE id = "${id}"`;
      let deletedAT = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      await promisePool.query(sql, [deletedAT]);
      resolve({
        errCode: 0,
        errMessage: "delete user successfully",
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  handleCheckUser,
  hashUserPassword,
  createUser,
  deleteUser,
};
