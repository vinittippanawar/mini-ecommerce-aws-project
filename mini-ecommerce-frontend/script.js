const API = "http://vinitzcloud.ap-south-1.elasticbeanstalk.com";

async function loadProducts() {
    const res = await fetch(`${API}/products`);
    const products = await res.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach((p) => {
        container.innerHTML += `
            <div class="product">
                <img src="${p.image}" />
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <button onclick='placeOrder("${p.id}")'>Buy Now</button>
            </div>
        `;
    });
}

async function placeOrder(productId) {
    const order = {
        orderId: "o" + Date.now(),
        productId: productId,
        timestamp: new Date().toISOString()
    };

    const res = await fetch(`${API}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });

    const data = await res.json();
    alert(data.message);
}

loadProducts();
