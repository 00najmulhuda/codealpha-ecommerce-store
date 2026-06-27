const products = [

{
image:"images/headphone.png",
name:"Noise Cancelling Headphones",
price:"$129.99"
},

{
image:"images/iphone.png",
name:"iPhone 15 Pro Max",
price:"$999.00"
},

{
image:"images/macbook.png",
name:"MacBook Air M2",
price:"$1199.00"
},

{
image:"images/watch-product.png",
name:"Apple Watch Series 9",
price:"$399.00"
},

];

const productGrid = document.getElementById("productGrid");

products.forEach(product=>{

productGrid.innerHTML += `

<div class="product-card">

<i class="fa-regular fa-heart wishlist"></i>

<img src="${product.image}" alt="${product.name}">

<h3 class="product-title">${product.name}</h3>

<p class="product-price">${product.price}</p>

<div class="product-footer">

<button class="cart-btn">

<i class="fa-solid fa-cart-shopping"></i>

</button>

</div>

</div>

`;

});