import express from "express";
const asyncHandler = require("express-async-handler");
import moment from "moment";
import { isEmptyValue } from "../helpers/check";

const db = require("../../connectDB");
const promisePool = db.promise();

let productRouter = express.Router();

productRouter.post(
  "/create-product",
  asyncHandler(async (req, res) => {
    let product = req.body;

    console.log(product.cate_code);

    let cate_id = await promisePool.query(
      `SELECT id FROM category WHERE cate_code = "${product.cate_code}"`
    );

    let category_id = cate_id[0][0].id;

    let sql = `INSERT INTO product SET name="${product.name}", description="${product.description}",
    total=${product.total},color="${product.color}",size=${product.size},
    price=${product.price}, image="${product.image}", category_id=${category_id}, prod_code="${product.prod_code}"`;

    console.log(sql);

    try {
      let prod = await promisePool.query(sql);
      if (!isEmptyValue(prod))
        res.status(200).json({
          errCode: 0,
          errMessage: "add product successfully",
        });
      else {
        res.status(404).json({
          errCode: 1,
          errMessage: "not valid prod",
        });
      }
    } catch (error) {
      if (error) console.log("error: " + error);
      res.status(404).json({
        errCode: 1,
        errMessage: "server bug",
      });
    }
  })
);

productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      let sql = `Select * FROM myshop.product`;
      console.log(sql);
      let [rows, fields] = await promisePool.query(sql);
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404);
        throw new Error("No product found");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ errCode: 1, errMessage: "server error" });
    }
  })
);

productRouter.get(
  "/get-product",
  asyncHandler(async (req, res) => {
    let query = req.query;
    if (query) {
      let sql = `Select 
        pr.id, pr.name, pr.description, pr.total, pr.color, pr.size,
        pr.sol_num, pr.price, pr.prod_promo, pr.prod_code, pr.image, pr.created_at, pr.deleted_at, pr.modified_at, 
        ct.cate_code
      FROM myshop.product pr JOIN myshop.category ct on pr.category_id = ct.id 
      ${!isEmptyValue(query) ? "WHERE" : ""}
      ${query.id ? `pr.id=${query.id}` : ""}
      ${query.id && query.cate_code ? "and" : ""}
      ${query.cate_code ? `ct.cate_code="${query.cate_code}"` : ""}
      ${
        (query.id && query.search) || (query.cate_code && query.search)
          ? "and"
          : ""
      }
      ${query.search ? `pr.name like "%${query.search}%"` : ""}
      ${
        (query.id && query.cate_id) ||
        (query.cate_code && query.cate_id) ||
        (query.search && query.cate_id)
          ? "and"
          : ""
      }
      ${query.cate_id ? `ct.id=${query.cate_id}` : ""}`;

      console.log(sql);
      let [rows, fields] = await promisePool.query(sql, [
        query.id,
        query.cate_code,
      ]);
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404);
        throw new Error("Category not found");
      }
    } else {
      res.status(404);
      throw new Error("Not valid id");
    }
  })
);

productRouter.post(
  "/edit",
  asyncHandler(async (req, res) => {
    let product = req.body;

    console.log(product.cate_code);

    let cate_id = await promisePool.query(
      `SELECT id FROM category WHERE cate_code = "${product.cate_code}"`
    );

    let category_id = cate_id[0][0].id;
    let modified_at = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    let sql = `UPDATE product SET name="${product.name}", description="${
      product.description
    }",
    total=${product.total},color="${product.color}",size=${product.size},
    price=${product.price}, image="${
      product.image
    }", category_id=${category_id},
    prod_code="${product.prod_code}", deleted_at=${
      product.deleted_at === "" ? null : `"${product.deleted_at}"`
    }, modified_at="${modified_at}"
    WHERE id="${product.id}"`;

    console.log(sql);

    try {
      let prod = await promisePool.query(sql);
      if (!isEmptyValue(prod))
        res.status(200).json({
          errCode: 0,
          errMessage: "edit product successfully",
        });
      else {
        res.status(404).json({
          errCode: 1,
          errMessage: "not valid prod",
        });
      }
    } catch (error) {
      if (error) console.log("error: " + error);
      res.status(404).json({
        errCode: 1,
        errMessage: "server bug",
      });
    }
  })
);

productRouter.post(
  "/edit/inactive",
  asyncHandler(async (req, res) => {
    let id = req.body.id;
    let deletedAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    if (id) {
      let sql = `UPDATE product SET deleted_at="${deletedAt}" WHERE id=${id}`;
      let [rows, fields] = await promisePool.query(sql);
      if (!isEmptyValue(rows)) {
        res.status(200).json({ errCode: 0, errMessage: "successfully  " });
      } else {
        res.status(404);
        throw new Error("Delete category fail!");
      }
    } else {
      res.status(404);
      throw new Error("Not valid id");
    }
  })
);

productRouter.post(
  "/edit/active",
  asyncHandler(async (req, res) => {
    let id = req.body.id;

    if (id) {
      let sql = `UPDATE product SET deleted_at=${null} WHERE id=${id}`;
      let [rows, fields] = await promisePool.query(sql);
      if (!isEmptyValue(rows)) {
        res.status(200).json({ errCode: 0, errMessage: "successfully  " });
      } else {
        res.status(404);
        throw new Error("Delete category fail!");
      }
    } else {
      res.status(404);
      throw new Error("Not valid id");
    }
  })
);

export default productRouter;
