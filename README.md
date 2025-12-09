# 🚀 Mini Ecommerce Project (Node.js → Elastic Beanstalk → DynamoDB → S3 Frontend Hosting)
*A fully deployed, beginner-friendly AWS cloud project for portfolio & resume.*

This project contains a complete mini e-commerce setup with:
- Backend API (Node.js on Elastic Beanstalk)
- Frontend (S3 Static Website Hosting)
- Database (DynamoDB)
- Product Images (S3 Bucket)

This README is written in **super simple baby-feeding style** — ANYONE can follow it.

---

# 🌟 1. Architecture Overview  

```
Frontend (HTML/JS) → S3 Static Website Hosting
                     ↓
Backend API → Elastic Beanstalk (Node.js)
                     ↓
Database → DynamoDB (Products + Orders)
                     ↓
Images → S3 Public Image Bucket
```

### 📸 Architecture Diagram  
<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# 🗂 2. Project Structure  

```
mini-ecommerce/
│
├── backend/
│   ├── app.js
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

---

# 🧠 3. Prerequisites  

- AWS Account  
- IAM User with **AdministratorAccess**  
- Region: **ap-south-1 (Mumbai)**  
- Node.js installed  
- Chrome Browser  

---

# 🍽 4. Step-by-Step Setup  

---

# ⭐ STEP 1 — Create DynamoDB Tables  

Go to → **AWS Console → DynamoDB → Tables**

---

## 🟩 1. Products Table  

| Setting | Value |
|--------|--------|
| Table name | Products |
| Partition key | id (String) |

Insert sample items:

```json
{
  "id": "p1",
  "name": "Wireless Earbuds",
  "price": 999,
  "description": "High quality wireless earbuds.",
  "image": "https://mini-ecommerce-images-vinit.s3.ap-south-1.amazonaws.com/wirless.jpg"
}
```

### 📸 Screenshot — DynamoDB Products  
<img src="ADD_YOUR_SCREENSHOT" width="900">

---

## 🟩 2. Orders Table  

| Setting | Value |
|--------|--------|
| Table name | Orders |
| Partition key | orderId (String) |

Example order:

```json
{
  "orderId": "o1733541580000",
  "productId": "p2",
  "timestamp": "2025-12-07T12:22:00Z"
}
```

### 📸 Screenshot — DynamoDB Orders  
<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# ⭐ STEP 2 — Create S3 Bucket for Product Images  

Create bucket:

```
mini-ecommerce-images-vinit
```

Upload images:
- wirless.jpg  
- speaker.jpeg  
- smartwatch.jpg  

---

### 🟩 Add Public Bucket Policy  

Go to → Bucket → Permissions → Bucket Policy

Paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mini-ecommerce-images-vinit/*"
    }
  ]
}
```

Test image:

```
https://mini-ecommerce-images-vinit.s3.ap-south-1.amazonaws.com/wirless.jpg
```

### 📸 Screenshot — S3 Image Bucket  
<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# ⭐ STEP 3 — Build Backend (Node.js + Express)

Create file: **app.js**

```js
const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

AWS.config.update({ region: "ap-south-1" });
const dynamo = new AWS.DynamoDB.DocumentClient();

app.get("/", (req, res) => res.send("Mini Ecommerce Backend Running!"));

app.get("/products", async (req, res) => {
  const data = await dynamo.scan({ TableName: "Products" }).promise();
  res.json(data.Items);
});

app.post("/order", async (req, res) => {
  await dynamo.put({ TableName: "Orders", Item: req.body }).promise();
  res.json({ message: "Order Created!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

Create file: **package.json**

```json
{
  "name": "mini-backend",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "*",
    "body-parser": "*",
    "cors": "*",
    "aws-sdk": "*"
  }
}
```

Install dependencies:

```
npm install
```

---

# ⭐ STEP 4 — Deploy Backend to Elastic Beanstalk  

Go to → Elastic Beanstalk → Create Application

### Settings:
- Platform → **Node.js 24**
- Environment → **Single instance**
- Upload ZIP (app.js + package.json + node_modules)

### IAM Roles:
- Service role → `aws-elasticbeanstalk-service-role-09`
- Instance profile → `aws-elasticbeanstalk-ec2-role`

Backend URL:

```
http://vinitzcloud.ap-south-1.elasticbeanstalk.com/
```

### 📸 Screenshot — Backend Running  
<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# ⭐ STEP 5 — Build Frontend  

Create **index.html**:

```html
<h1>Mini Store</h1>
<div id="products"></div>
<script src="script.js"></script>
```

Create **script.js**:

```js
const backendURL = "http://vinitzcloud.ap-south-1.elasticbeanstalk.com";

async function loadProducts() {
  const res = await fetch(backendURL + "/products");
  const data = await res.json();

  document.getElementById("products").innerHTML =
    data.map(
      (p) => `
      <div>
        <img src="${p.image}" width="150">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </div>
    `
    ).join("");
}

loadProducts();
```

---

# ⭐ STEP 6 — Host Frontend on S3  

Create bucket:

```
mini-ecommerce-frontend-vinit
```

Enable **Static Website Hosting**  
Set index: `index.html`

---

## 🟩 Add Public Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mini-ecommerce-frontend-vinit/*"
    }
  ]
}
```

Upload:
- index.html  
- script.js  
- style.css  

Frontend URL:

```
http://mini-ecommerce-frontend-vinit.s3-website.ap-south-1.amazonaws.com/
```

### 📸 Screenshot — Frontend Live  
<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# ⭐ STEP 7 — Test Everything  

### ✔️ Products load  
### ✔️ Images load  
### ✔️ Orders appear in DynamoDB  
### ✔️ Backend reachable  
### ✔️ Frontend works on S3  

---

# 📊 (Optional) Add CloudFront + HTTPS  
Ask me:  
**“Add CloudFront section”**

---

# 👨‍💻 Author  

**Vinit Tippanawar**  
AWS | Cloud | DevOps  

*If you like this project, ⭐ star the repo!*
