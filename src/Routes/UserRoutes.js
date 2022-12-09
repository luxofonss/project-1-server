import express from "express";
import { matchPassword } from "../utils/index";
const asyncHandler = require("express-async-handler");
import generateToken from "../utils/GenerateToken";
import protect from "../Middleware/AuthMiddleware";
import { handleCheckUser, hashUserPassword } from "../utils/index";
import moment from "moment";

const db = require("../../connectDB");
const promisePool = db.promise();

let userRouter = express.Router();

userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    if (!email || !password) {
      return res.status(200).json({
        errCode: 2,
        errMessage: "Missing data",
      });
    } else {
      let sql = `SELECT * FROM myshop.user WHERE email = "${email}" `;
      let [rows] = await promisePool.query(sql);
      let userData = rows[0];
      let checkPassword = await matchPassword(email, password);
      if (checkPassword) {
        res.status(200).json({
          ...userData,
          token: generateToken({
            id: userData.id,
            phone_num: userData.phone_num,
          }),
        });
      } else {
        res.status(400).json({
          errCode: 2,
          errMessage: "Incorrect email or password!",
        });
      }
    }
  })
);

userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    let [rows, fields] = await promisePool.query(
      `SELECT * FROM myshop.user WHERE id = ${req.user.id}`
    );
    let user = rows[0];
    if (user) {
      res.status(200).json({
        id: user.id,
        name: user.full_name,
        email: user.email,
        phoneNumber: user.phone_num,
        role: user.role,
        createAt: user.created_at,
      });
    } else {
      res.status(404);
      throw new Error("User not found!");
    }
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    if (!req.body.password) {
      res.status(400);
      throw new Error("missing data");
    }

    let hashPassword = await hashUserPassword(req.body.password);
    let createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    let userData = {
      email: req.body.email,
      phone_num: req.body.phone_num,
      full_name: req.body.full_name,
      role: "user",
      address: req.body.address,
      password: hashPassword,
      created_at: createdAt,
    };

    let checkValidUser = await handleCheckUser(
      req.body.email,
      req.body.phone_num
    );

    if (!checkValidUser) {
      res.status(400);
      throw new Error("user already exists");
    }

    let sqlCreateUser = `INSERT INTO myshop.user SET ?`;
    await promisePool.query(sqlCreateUser, [userData]);
    const [user, fields] = await promisePool.query(
      `SELECT * FROM myshop.user WHERE password ="${hashPassword}"`
    );
    let newUser = user[0];
    if (newUser) {
      res.status(201).json({
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone_num: newUser.phone_num,
        role: newUser.role,
        token: generateToken({ id: newUser.id, phone_num: newUser.phone_num }),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data.");
    }
  })
);

export default userRouter;
