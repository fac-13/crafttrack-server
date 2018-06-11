require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


// config middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (_, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// DATABASE ENDPOINTS
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
app.get("/getItems", (req, res) => {
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

// add new item to make
app.post("/postItem", (req, res) => {
	ddb.putItem(req.body, (err) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			console.log("Successfully added data");
			res.json({ msg: "success"});
		}
	});
});

// // update item status
// app.put("/putItemStatus", (req, res, next) => {
//   //mark cut or sew or both as done
//   const params = req.body.newItem;
//   ddb.updateItem(params, (err, data) => {});
// });

module.exports = app;