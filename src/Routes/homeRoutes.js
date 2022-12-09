import express from "express";
const db = require("../../connectDB");

const promisePool = db.promise();

let homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    let sql = "SELECT * FROM myshop.user WHERE deleted_at IS NULL";
    let [rows, fields] = await promisePool.query(sql);
    res.status(200).json({
      errCode: 0,
      errMessage: "successfully",
      rows,
    });
  } catch (error) {
    res.status(500).json({
      errCode: 2,
      errMessage: "error from server",
    });
  }
});

export default homeRouter;
