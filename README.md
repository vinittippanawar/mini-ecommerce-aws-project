# 🚀 Mini Ecommerce Project (Node.js → Elastic Beanstalk → DynamoDB → S3 Frontend Hosting)
A fully deployed, beginner-friendly AWS cloud project for portfolio & resume.

This project contains:
- Backend API (Node.js on Elastic Beanstalk)
- Frontend (S3 Static Website Hosting)
- DynamoDB Tables (Products + Orders)
- Product Images (S3 Bucket)
- Full step-by-step setup including all issues faced during deployment

---

# 🌟 1. Architecture Overview  

```
Frontend (HTML/JS) → S3 Static Website Hosting
                     ↓
Backend API → Elastic Beanstalk (Node.js)
                     ↓
DynamoDB (Products + Orders)
                     ↓
S3 Image Bucket (Public Images)
```

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
│   ├── style.css
│
└── README.md
```

---

# 🧠 3. Prerequisites  
- AWS Account  
- IAM Admin user  
- Region: ap-south-1 (Mumbai)  
- Node.js installed
- basic file creation 
  

---

# ⭐ STEP 1 — Create DynamoDB Tables  

## 1️⃣ Products Table  
```
Table name: Products
Partition key: id (String)
```

then go to products table and click on create items then 
Insert sample items:

```json
{
  "id": "p1",
  "name": "Wireless Earbuds",
  "price": 999,
  "description": "High quality wireless earbuds.",
  "image": ""
}

```

📌 Note:
Keep the "image" field blank when inserting the product for the first time.
After uploading product images to your S3 bucket, copy the public S3 URL and update this field with the actual image link for each image.

```
https://mini-ecommerce-images-vinit.s3.ap-south-1.amazonaws.com/wirless.jpg
```

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/ba156585-1ef7-4f84-9405-e38b69904869" />



---

## 2️⃣ Orders Table  
```
Table name: Orders
Partition key: orderId (String)
```


<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/47898d5e-bcf4-452e-bf3e-4b7db10da168" />

---

# ⭐ STEP 2 — Create S3 Bucket for Product Images  

Bucket name:
```
mini-ecommerce-images-vinit
```

Upload:
- wirless.jpg  
- speaker.jpeg  
- smartwatch.jpg

📌 Note: make sure disable the button of block all public access while creating bucket so it ensure that bucket is publically accessible.

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/e53721f6-85aa-4597-a6fc-ab7fa8337411" />


## Add Public Bucket Policy:

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

Test each image: s3 → buckets → mini-ecommerce-images-vinit → click on any images → look at object url in permission section.
```
https://mini-ecommerce-images-vinit.s3.ap-south-1.amazonaws.com/wirless.jpg
```

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/fc16ed2b-89d1-4168-a1b2-751a1f3c27b8" />


<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/afddfb27-1d62-411e-a97a-7e8e56bbf9b0" />

---

# ⭐ STEP 3 — Build Backend (Node.js + Express)
1.create a folder in your local pc name as **mini-ecom-backend**
2.then open this in folder in **vs code** or locally you can do it 
3.then create file and name as **app.js** along with that **package.json** also edit with follwing code.

**app.js** 

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

// Required for Elastic Beanstalk
app.listen(process.env.PORT || 8080, () =>
  console.log("Server running...")
);
```

**package.json**

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

Install: run this on command line make sure that directory should be backend folder while installing npm

```
npm install
```
after that go to your file manager and select both file and also node_modules if automatically created
Zip files INSIDE backend folder → **backend.zip**

---

# ⭐ STEP 4 — Create Elastic Beanstalk IAM Roles  

## Service Role  
Name:
```
aws-elasticbeanstalk-service-role-09
```

Attach:
- AWSElasticBeanstalkEnhancedHealth  
- AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy  

## EC2 Instance Profile  
Name:
```
aws-elasticbeanstalk-ec2-role
```

Attach:
- AWSElasticBeanstalkWebTier  
- AWSElasticBeanstalkWorkerTier  
- AWSElasticBeanstalkMulticontainerDocker  
- AmazonDynamoDBFullAccess  
- AmazonS3ReadOnlyAccess  

---

# ⭐ STEP 5 — Fix VPC Internet Gateway Issue (Important)
You faced the error:
```
Network vpc-xxxx is not attached to any internet gateway
```

Fix:

### 1. Go to → VPC → Internet Gateway  
- Create IGW  
- Attach to your VPC  

### 2. Route Table  
Add route:
```
0.0.0.0/0 → igw-xxxx
```

Now EC2 instance can reach the internet.

---

# ⭐ STEP 6 — Deploy Backend to Elastic Beanstalk  

Go to:
Elastic Beanstalk → Create Application

### Application
```
Name: mini-ecommerce
```

### Environment
```
Name: mini-env
Platform: Node.js 24
Upload: backend.zip
```

### Service Access
```
Service role: aws-elasticbeanstalk-service-role-09
Instance profile: aws-elasticbeanstalk-ec2-role
```

### Networking
```
VPC: default
Public IP: Enabled
Subnets: select 2 public subnets
```

### Instance
```
Type: t3.micro
Environment: Single instance
```

Backend URL:

```
http://vinitzcloud.ap-south-1.elasticbeanstalk.com/
```

<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# ⭐ STEP 7 — Test Backend  

Visit:

```
http://vinitzcloud.ap-south-1.elasticbeanstalk.com/
```

Response:
```
Mini Ecommerce Backend Running!
```

Test API:

```
/products
/order
```

---

# ⭐ STEP 8 — Build Frontend  

Create **frontend/index.html**:

```html
<h1>Mini Store</h1>
<div id="products"></div>
<script src="script.js"></script>
```

Create **frontend/script.js**:

```js
const backendURL = "http://vinitzcloud.ap-south-1.elasticbeanstalk.com";

async function loadProducts() {
  const res = await fetch(backendURL + "/products");
  const products = await res.json();

  document.getElementById("products").innerHTML =
    products.map(p => `
      <div>
        <img src="${p.image}" width="150">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </div>
    `).join("");
}

loadProducts();
```

Create **frontend/style.css**:

```css
body { font-family: Arial; padding: 20px; }
#products { display: flex; gap: 20px; flex-wrap: wrap; }
```

---

# ⭐ STEP 9 — Create S3 Bucket for Frontend  

Bucket name:

```
mini-ecommerce-frontend-vinit
```

---

# ⭐ STEP 10 — Enable Static Website Hosting  

Go to:
Properties → Static Website Hosting → Enable

Index document:
```
index.html
```

Copy Website Endpoint.

---

# ⭐ STEP 11 — Add Public Bucket Policy  

Go to:
Permissions → Bucket Policy

Paste:

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

---

# ⭐ STEP 12 — Upload Frontend Files  

Upload:
- index.html  
- script.js  
- style.css  

Your live frontend:

```
http://mini-ecommerce-frontend-vinit.s3-website.ap-south-1.amazonaws.com/
```

<img src="ADD_YOUR_SCREENSHOT" width="900">

---

# 🎉 Project Working Successfully  

✔ Products load  
✔ Images load  
✔ Orders stored in DynamoDB  
✔ Backend EB works  
✔ Frontend S3 works  

---

# 👨‍💻 Author  
**Vinit Tippanawar**  
AWS | Cloud | DevOps  

*If you like this project, ⭐ star the repo!*
