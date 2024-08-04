// Ürünleri Yükleme ve Arama
function loadAllProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productListElement = document.getElementById('all-products');
    const searchQuery = document.getElementById('search-products').value.toLowerCase();

    productListElement.innerHTML = '';

    products
        .filter(product => product.name.toLowerCase().includes(searchQuery))
        .forEach(product => {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.src = product.image || '';
            img.alt = product.name;
            img.style.width = '50px';
            img.style.height = '50px';
            listItem.appendChild(img);

            const text = document.createTextNode(`${product.name} - Fiyat: ${product.price} TL - Kar: ${product.profit} TL - Miktar: ${product.quantity}`);
            listItem.appendChild(text);

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.onclick = () => updateProductQuantity(product.name, 1);

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.onclick = () => updateProductQuantity(product.name, -1);

            listItem.appendChild(increaseButton);
            listItem.appendChild(decreaseButton);

            const cashButton = document.createElement('button');
            cashButton.textContent = 'Nakit Satış';
            cashButton.onclick = () => sellProduct(product.name, 'cash');

            const cardButton = document.createElement('button');
            cardButton.textContent = 'Kart Satış';
            cardButton.onclick = () => sellProduct(product.name, 'card');

            const creditButton = document.createElement('button');
            creditButton.textContent = 'Veresiye Satış';
            creditButton.onclick = () => sellProduct(product.name, 'credit');

            listItem.appendChild(cashButton);
            listItem.appendChild(cardButton);
            listItem.appendChild(creditButton);

            productListElement.appendChild(listItem);
        });
}

// Ürün Arama Fonksiyonu
function searchProducts() {
    loadAllProducts(); // Arama yapıldığında ürünleri yeniden yükle
}

// Ürün Ekleme Fonksiyonu
function addProduct() {
    const productName = document.getElementById('new-product-name').value;
    const productPrice = parseFloat(document.getElementById('new-product-price').value);
    const productProfit = parseFloat(document.getElementById('new-product-profit').value);
    const productQuantity = parseInt(document.getElementById('new-product-quantity').value);
    const productImage = document.getElementById('new-product-image').files[0];
    const reader = new FileReader();

    if (productName && productPrice && productProfit && productQuantity && productImage) {
        reader.onload = function(e) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const existingProduct = products.find(product => product.name === productName);

            if (existingProduct) {
                existingProduct.quantity += productQuantity;
            } else {
                const product = {
                    name: productName,
                    price: productPrice,
                    profit: productProfit,
                    quantity: productQuantity,
                    image: e.target.result,
                    category: '' // Kategori seçilecek
                };
                products.push(product);
            }

            localStorage.setItem('products', JSON.stringify(products));
            loadAllProducts();
            alert('Ürün başarıyla eklendi!');
        };
        reader.readAsDataURL(productImage);
    } else {
        alert('Lütfen tüm alanları doldurun!');
    }
}

// Ürün Miktarını Güncelleme Fonksiyonu
function updateProductQuantity(name, amount) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.name === name);

    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            products.splice(products.indexOf(product), 1);
        }
        localStorage.setItem('products', JSON.stringify(products));
        loadAllProducts();
    }
}

// Ürün Satışı Fonksiyonu
function sellProduct(name, category) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.name === name);

    if (product) {
        product.category = category;
        product.quantity -= 1;

        if (product.quantity <= 0) {
            products.splice(products.indexOf(product), 1);
        }

        localStorage.setItem('products', JSON.stringify(products));
        loadAllProducts();
    }
}

// Sayfa yüklendiğinde ürünleri yükleme
window.onload = function() {
    loadAllProducts();
};
