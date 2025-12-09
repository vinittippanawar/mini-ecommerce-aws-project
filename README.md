# 🚀 Mini Ecommerce Project (Node.js → Elastic Beanstalk → DynamoDB → S3 Frontend Hosting)

A fully deployed, cloud-ready mini ecommerce application built on AWS.  
This project demonstrates **real-world fullstack deployment** using AWS services.

This setup includes:
- **Backend API** (Node.js on Elastic Beanstalk)
- **Frontend** (Static website hosted on Amazon S3)
- **Database** (DynamoDB tables for Products & Orders)
- **Image Hosting** (Public S3 bucket for product images)
- **Complete step-by-step guide**, including attached images for better understanding


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
**📸ARCHITECTURE IMAGE**

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/24fce5a6-f6f0-467c-a6bb-e672c522d8f1" />

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
```
1. Create a folder in your local PC named **mini-ecom-backend**  
2. Open this folder in VS Code  
3. Create a file named **app.js**  
4. Create a **package.json** file and paste the following code  
```

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
```
after that go to your file manager and select both file and also node_modules if automatically created
Zip files INSIDE backend folder → **backend.zip**
```


<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/39ef09ae-8258-4cc9-9834-63b826a6975a" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/cd515c69-dda9-4dc7-9fac-b40ccccd5a38" />

---

# ⭐ STEP 4 — Create Elastic Beanstalk IAM Roles  

> ⚠️ Note:  
> These IAM roles are created during the Elastic Beanstalk environment setup.  
> You can also create them manually if needed.  
> Elastic Beanstalk will ask for:  
> 1️⃣ A **Service Role** (used by Elastic Beanstalk itself)  
> 2️⃣ An **EC2 Instance Profile** (used by the EC2 instance running your app) 

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

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/03c5ca17-3874-463a-8349-4581fac219f6" />

---

# ⭐ STEP 5 — Fix VPC Internet Gateway Issue (Important)
I faced the error:
```
Network vpc-xxxx is not attached to any internet gateway
```

Fix:

### 1. Go to → VPC → Internet Gateway  
- Create IGW  
- Attach to your VPC  (default) 

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

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/0b36a2c7-b7dd-48c8-bff4-9a45f6aa3fa1" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/4e64cce6-835b-4a71-9728-177fc9705f34" />

---

# ⭐ STEP 7 — Test Backend  

Visit:Elastic Beanstalk → Environments → mini-ecommerce-env → check domain

```
http://vinitzcloud.ap-south-1.elasticbeanstalk.com/
```
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/020f9a79-ddce-4948-a66e-86e9b729ec83" />


Response:
```
Mini Ecommerce Backend Running!
```
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/320d5878-b4b9-4583-b3f6-d2ab6ff07af2" />

---

# ⭐ STEP 8 — Build Frontend  
```
1. Create a folder in your local PC named **mini-ecom-frontend**  
2. Open this folder in VS Code  
3. Create a file named **index.html** file and paste the following code 
4. Create a **script.js** file and paste the following code
5. Create a **style.css** file and paste the following code
```

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
<img width="1408" height="371" alt="Image" src="https://github.com/user-attachments/assets/c78f78d2-c9ad-4fd2-8507-c2f77e4b059a" />

---

# ⭐ STEP 9 — Create S3 Bucket for Frontend  

Bucket name:

```
mini-ecommerce-frontend-vinit
```
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/83c249d8-0084-4739-b732-9a993190af88" />

---

# ⭐ STEP 10 — Enable Static Website Hosting  

Go to:
Properties → Static Website Hosting → Enable

Index document:
```
index.html
```

Copy Website Endpoint.


<img width="1447" height="358" alt="Image" src="https://github.com/user-attachments/assets/80592a4b-78d1-472e-90cb-7bafe6cb5fbe" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/74a365f9-f16b-4140-82eb-c1e06e404621" />

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
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/b3fe5ce8-0dc2-418d-a90b-f2bd3c60cd5c" />

---

# ⭐ STEP 12 — Upload Frontend Files  
```
Upload:
- index.html  
- script.js  
- style.css
```

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/869638fd-7851-4e87-895e-6f74678e6e11" />

Your live frontend:

```
http://mini-ecommerce-frontend-vinit.s3-website.ap-south-1.amazonaws.com/
```
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/b061a731-d7af-4050-b7e5-7f2ecacbdb5a" />

---

# 🎉 Project Working Successfully  

✔ Products load  
✔ Images load  
✔ Orders stored in DynamoDB  
✔ Backend works  
✔ Frontend S3 works  

---

# 👨‍💻 Author  
**Vinit Tippanawar**  
AWS | Cloud | DevOps  

*If you like this project, ⭐ star the repo!*
