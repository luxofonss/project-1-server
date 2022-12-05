import jwt from "jsonwebtoken";
const asyncHandler = require("express-async-handler");

const db = require("../../connectDB");
const promisePool = db.promise();

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      let [rows, fields] = await promisePool.query(
        `SELECT *, NULL AS password FROM myshop.user WHERE id = ${decode.id}`
      );
      req.user = rows[0];

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized,token failed");
    }
  }
  console.log(token);
  if (token === null) {
    res.status(401);
    throw new Error("Not authorized,token is invalid");
  }
});

export default protect;
