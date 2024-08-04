// Ürün Satışı Fonksiyonu - Her katalog için farklı miktar ekleyebilmek için güncellenmiş
function sellProduct(name, category, quantity) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.name === name);

    if (product) {
        const existingCategory = product.categories.find(cat => cat.name === category);
        if (existingCategory) {
            existingCategory.quantity += quantity;
        } else {
            product.categories.push({ name: category, quantity: quantity });
        }

        localStorage.setItem('products', JSON.stringify(products));
        loadAllProducts();
    }
}

// Ürünler Sayfasındaki Ürünleri Yükleme
function loadAllProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productListElement = document.getElementById('all-products');

    productListElement.innerHTML = '';

    products.forEach(product => {
        const listItem = document.createElement('li');
        const img = document.createElement('img');
        img.src = product.image || '';
        img.alt = product.name;
        img.style.width = '50px';
        img.style.height = '50px';
        listItem.appendChild(img);

        const text = document.createTextNode(`${product.name} - Fiyat: ${product.price} TL - Kar: ${product.profit} TL`);
        listItem.appendChild(text);

        const increaseCashButton = document.createElement('button');
        increaseCashButton.textContent = 'Nakit Satış Ekle';
        increaseCashButton.onclick = () => sellProduct(product.name, 'cash', parseInt(prompt('Eklenecek miktarı girin:', 1)));

        const increaseCardButton = document.createElement('button');
        increaseCardButton.textContent = 'Kart Satış Ekle';
        increaseCardButton.onclick = () => sellProduct(product.name, 'card', parseInt(prompt('Eklenecek miktarı girin:', 1)));

        const increaseCreditButton = document.createElement('button');
        increaseCreditButton.textContent = 'Veresiye Satış Ekle';
        increaseCreditButton.onclick = () => sellProduct(product.name, 'credit', parseInt(prompt('Eklenecek miktarı girin:', 1)));

        listItem.appendChild(increaseCashButton);
        listItem.appendChild(increaseCardButton);
        listItem.appendChild(increaseCreditButton);

        productListElement.appendChild(listItem);
    });
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

// Sayfa yüklendiğinde ürünleri yükleme
window.onload = function() {
    loadAllProducts();
};
