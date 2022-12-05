import express from "express";
const asyncHandler = require("express-async-handler");
import moment from "moment";
import { isEmptyValue } from "../helpers/check";

const db = require("../../connectDB");
const promisePool = db.promise();

let productRouter = express.Router();

productRouter.post(
  "/create-category",
  asyncHandler(async (req, res) => {
    let createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let category = { ...req.body, created_at: createdAt };

    const [isExist, existFields] = await promisePool.query(
      `SELECT * FROM category WHERE cate_code = '${category.cate_code}'`
    );

    if (isEmptyValue(isExist)) {
      let sql = `INSERT INTO myshop.category SET name= "${category.name}", created_at= "${category.created_at}", 
        description="${category.description}", cate_code="${category.cate_code}"`;

      await promisePool.query(sql, [category]);
      let [newCates, newCateFields] = await promisePool.query(
        `SELECT * FROM category WHERE cate_code = "${category.cate_code}"`
      );
      let newCate = newCates[0];

      if (newCate) {
        res.status(200).json({
          id: newCate.id,
          name: newCate.name,
          description: newCate.description,
          createAt: newCate.created_at,
        });
      } else {
        res.status(404);
        throw new Error("Add category fail!");
      }
    } else {
      res.status(404);
      throw new Error("Category has already exist!");
    }
  })
);

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
    let sql = "Select * FROM myshop.product";
    let [rows, fields] = await promisePool.query(sql);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404);
      throw new Error("Add category fail!");
    }
  })
);

productRouter.get(
  "/get-product",
  asyncHandler(async (req, res) => {
    let id = req.query.id;
    console.log(id);
    if (id) {
      let sql = `Select * FROM myshop.product WHERE id=${id}`;
      let [rows, fields] = await promisePool.query(sql);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404);
        throw new Error("Add category fail!");
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

    let sql = `UPDATE product SET name="${product.name}", description="${product.description}",
    total=${product.total},color="${product.color}",size=${product.size},
    price=${product.price}, image="${product.image}", category_id=${category_id}, prod_code="${product.prod_code}" WHERE id="${product.id}"`;

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
  "/inactive",
  asyncHandler(async (req, res) => {
    let id = req.query.id;
    let deletedAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    if (id) {
      let sql = `UPDATE product SET deleted_at="${deletedAt}" WHERE id=${id}`;
      let [rows, fields] = await promisePool.query(sql);
      console.log("rest", rows);
      if (!isEmptyValue(rows)) {
        res.status(200).json({ errCode: 0, errMessage: "successfullyhh  " });
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
