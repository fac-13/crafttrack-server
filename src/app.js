require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


// config middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (_, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:1234");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// HELLO ENDPOINT

app.get("/", (req, res) => {
	res.json({ message: "hello world"});
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
app.post("/postItem", (req, res, next) => {
	ddb.putItem(req.body, (err, data) => err ? res.status(500).json({ error: err.message }) : console.log("Successfully added data"));
});

// // update item status
// app.put("/putItemStatus", (req, res, next) => {
//   //mark cut or sew or both as done
//   const params = req.body.newItem;
//   ddb.updateItem(params, (err, data) => {});
// });

module.exports = app;