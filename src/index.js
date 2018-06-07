require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => {
  console.log(`app is running on http://${host}:${port}`);
});

// config middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
// Set the region
AWS.config.update({
  region: "eu-west-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

// getItems route
app.get("/getItems", (req, res, next) => {
  const params = {
    TableName: "Crafts"
  };
  ddb.scan(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.json({
        error: "database error"
      });
    } else {
      res.json({
        responseData: data
      });
      console.log("Success", data);
    }
  });
});

// // add new item to make
// app.post("/postItem", (req, res, next) => {
//   const params = req.body.newItem;
//   ddb.putItem(params, (err, data) => {});
// });

// // update item status
// app.put("/putItemStatus", (req, res, next) => {
//   //mark cut or sew or both as done
//   const params = req.body.newItem;
//   ddb.updateItem(params, (err, data) => {});
// });
