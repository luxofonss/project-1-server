import express from "express";
const asyncHandler = require("express-async-handler");
import moment from "moment";
import { isEmptyValue } from "../helpers/check";
import { addCategoryValidator } from "../helpers/validator";

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

categoryRouter.post(
  "/add",
  asyncHandler(async (req, res) => {
    let created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let data = req.body;
    let checkData = addCategoryValidator(data);
    if (checkData) {
      try {
        let sql = `INSERT INTO myshop.category SET name="${data.name}" , description="${data.description}", 
        created_at="${created_at}", total_prod=${data.total_prod}, cate_code="${data.cate_code}" `;
        await promisePool.query(sql);
        res
          .status(200)
          .json({ errCode: 0, errMessage: "Category added successfully" });
      } catch (error) {
        res.status(404).json({ errCode: 1, errMessage: "sever bug" });
      }
    } else {
      res
        .status(400)
        .json({ errCode: 2, errMessage: "missing data parameters" });
    }
  })
);

export default categoryRouter;
