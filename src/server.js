import express from "express";
import bodyParser from "body-parser"; //get params
import viewEngine from "./config/viewEngine";
import { notFound, errorHandler } from "./Middleware/error";
import homeRouter from "./Routes/homeRoutes";
import userRouter from "./Routes/UserRoutes";
import productRouter from "./Routes/ProductRoutes";
import categoryRouter from "./Routes/CategoryRoutes";

var db = require("../connectDB");
var cors = require("cors");

require("dotenv").config();

let app = express();
app.use(cors({ origin: true }));
// config app

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", homeRouter);
app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);

viewEngine(app);

app.use(notFound);
app.use(errorHandler);
let port = process.env.PORT || 6969;
//Port  === undefined -> port=6060

app.listen(port, () => {
  console.log(Date.now());
  console.log(`Server listening on port:  ${port}`);
  db.getConnection(function (err, connection) {
    if (err) throw err;
    console.log("Database connected!");
  });
  console.log(`Server listening`);
});
