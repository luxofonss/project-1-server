import express from "express";
const asyncHandler = require("express-async-handler");
import moment from "moment";
import { isEmptyValue } from "../helpers/check";

const db = require("../../connectDB");
const promisePool = db.promise();

let categoryRouter = express.Router();

categoryRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    let sql = "Select * FROM myshop.category";
    console.log(sql);
    let [rows, fields] = await promisePool.query(sql);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404);
      throw new Error("Add category fail!");
    }
  })
);

export default categoryRouter;
