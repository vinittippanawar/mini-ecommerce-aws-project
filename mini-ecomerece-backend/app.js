const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure AWS Region
AWS.config.update({ region: "ap-south-1" }); // Mumbai region

// DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

// Test Route
app.get("/", (req, res) => {
  res.send("Mini Ecommerce Backend Running!");
});

// Get Products
app.get("/products", async (req, res) => {
  const params = {
    TableName: "Products",
  };

  try {
    const data = await dynamo.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Create Order
app.post("/order", async (req, res) => {
  const order = req.body;

  const params = {
    TableName: "Orders",
    Item: order,
  };

  try {
    await dynamo.put(params).promise();
    res.json({ message: "Order Created!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ----------------------------
// FIX FOR ELASTIC BEANSTALK
// ----------------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
