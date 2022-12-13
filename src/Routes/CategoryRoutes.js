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
    let query = req.query;
    try {
      let sql = `Select * FROM myshop.category ${
        !isEmptyValue(query) ? "WHERE" : ""
      }
       ${query.id ? `id=${query.id}` : ""}
       ${query.search ? `name like "%${query.search}%"` : ""}`;
      console.log(sql);
      let [rows, fields] = await promisePool.query(sql);
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404);
        throw new Error("Find category fail!");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Sever error", error);
    }
  })
);

categoryRouter.post(
  "/add",
  asyncHandler(async (req, res) => {
    let created_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let data = req.body;
    let cate_code = data.cate_code;

    let sqlCheckExistCategory = `Select * from myshop.category where cate_code = '${cate_code}'`;

    let [rows, fields] = promisePool.query(sqlCheckExistCategory);

    if (rows.length > 0) {
      res.status(400).json({
        errCode: 3,
        errMessage: "Category already exists",
      });
    } else {
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
    }
  })
);

categoryRouter.post(
  "/edit",
  asyncHandler(async (req, res) => {
    let data = req.body;
    if (data.name) {
      try {
        let modified_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let sql = `UPDATE myshop.category SET name="${data.name}" , description="${data.description}", modified_at="${modified_at}" WHERE id=${data.id}`;
        await promisePool.query(sql);
        res
          .status(200)
          .json({ errCode: 0, errMessage: "Category edited successfully" });
      } catch (error) {
        console.log(error);
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
