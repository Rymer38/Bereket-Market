// Verilerin saklanması ve alınması için LocalStorage kullanılıyor
function getStoredData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Toptancı Borçları ve Ürün Veritabanı
const wholesalers = getStoredData('wholesalers');
const products = getStoredData('products');

// Gelir-Gider Tablolarını Güncelleme Fonksiyonu
function updateFinanceTable() {
    let cashIncome = 0;
    let cardIncome = 0;
    let creditIncome = 0;
    let totalExpense = 0;
    let netProfit = 0;

    products.forEach(product => {
        const totalRevenue = product.price * product.quantity;
        const totalProfit = product.profit * product.quantity;

        if (product.category === 'cash') {
            cashIncome += totalRevenue;
        } else if (product.category === 'card') {
            cardIncome += totalRevenue;
        } else if (product.category === 'credit') {
            creditIncome += totalRevenue;
        }

        totalExpense += product.price * product.quantity;
        netProfit += totalProfit;
    });

    const totalIncome = cashIncome + cardIncome + creditIncome;

    document.getElementById('cash-income').textContent = cashIncome;
    document.getElementById('card-income').textContent = cardIncome;
    document.getElementById('credit-income').textContent = creditIncome;
    document.getElementById('total-income').textContent = totalIncome;
    document.getElementById('total-expense').textContent = totalExpense;
    document.getElementById('net-profit').textContent = netProfit;
}

// Mevcut toptancıları ve ürünleri ekrana yüklemek için fonksiyonlar
function loadWholesalers() {
    const wholesalerSelect = document.getElementById('wholesaler-select');
    const wholesalerDebtsElement = document.getElementById('wholesaler-debts');
    wholesalerSelect.innerHTML = '';
    wholesalerDebtsElement.innerHTML = '';

    wholesalers.forEach((wholesaler, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${wholesaler.name} - Borç: ${wholesaler.debt} TL`;
        wholesalerSelect.appendChild(option);

        const listItem = document.createElement('li');
        listItem.textContent = `${wholesaler.name} - Borç: ${wholesaler.debt} TL`;
        wholesalerDebtsElement.appendChild(listItem);
    });
}

function loadProducts() {
    const cashSalesElement = document.getElementById('cash-sales');
    const cardSalesElement = document.getElementById('card-sales');
    const creditSalesElement = document.getElementById('credit-sales');

    cashSalesElement.innerHTML = '';
    cardSalesElement.innerHTML = '';
    creditSalesElement.innerHTML = '';

    products.forEach(product => {
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

        if (product.category === 'cash') {
            cashSalesElement.appendChild(listItem);
        } else if (product.category === 'card') {
            cardSalesElement.appendChild(listItem);
        } else if (product.category === 'credit') {
            creditSalesElement.appendChild(listItem);
        }
    });

    updateFinanceTable();
}

// Sayfa yüklendiğinde toptancıları ve ürünleri yükle
window.onload = function() {
    loadWholesalers();
    loadProducts();
};

// Ürün Miktarını Güncelleme Fonksiyonu
function updateProductQuantity(productName, quantityChange) {
    const product = products.find(p => p.name === productName);
    if (product) {
        product.quantity += quantityChange;
        storeData('products', products);
        loadProducts();
    }
}

// Toptancı Borcunu Ekleme Fonksiyonu
function addWholesalerDebt() {
    const wholesalerName = document.getElementById('wholesaler-name').value;
    const wholesalerDebt = parseFloat(document.getElementById('wholesaler-debt').value);

    wholesalers.push({ name: wholesalerName, debt: wholesalerDebt });
    storeData('wholesalers', wholesalers);
    loadWholesalers();
}

// Toptancı Borcunu Arttırma ve Azaltma Fonksiyonları
function increaseWholesalerDebt() {
    const selectedIndex = document.getElementById('wholesaler-select').value;
    const amount = parseFloat(prompt('Borcu arttırmak için miktar girin:'));
    if (selectedIndex !== null && !isNaN(amount)) {
        wholesalers[selectedIndex].debt += amount;
        storeData('wholesalers', wholesalers);
        loadWholesalers();
    }
}

function decreaseWholesalerDebt() {
    const selectedIndex = document.getElementById('wholesaler-select').value;
    const amount = parseFloat(prompt('Borcu azaltmak için miktar girin:'));
    if (selectedIndex !== null && !isNaN(amount)) {
        wholesalers[selectedIndex].debt -= amount;
        storeData('wholesalers', wholesalers);
        loadWholesalers();
    }
}

// Gün Kaydetme Fonksiyonu
function saveDay() {
    products.forEach(product => {
        product.quantity = 0; // Satışları sıfırla
    });
    storeData('products', products);
    loadProducts();
    alert('Gün kaydedildi ve satışlar sıfırlandı.');
}

// Ürün Arama Fonksiyonu
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));

    const cashSalesElement = document.getElementById('cash-sales');
    const cardSalesElement = document.getElementById('card-sales');
    const creditSalesElement = document.getElementById('credit-sales');

    cashSalesElement.innerHTML = '';
    cardSalesElement.innerHTML = '';
    creditSalesElement.innerHTML = '';

    filteredProducts.forEach(product => {
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

        if (product.category === 'cash') {
            cashSalesElement.appendChild(listItem);
        } else if (product.category === 'card') {
            cardSalesElement.appendChild(listItem);
        } else if (product.category === 'credit') {
            creditSalesElement.appendChild(listItem);
        }
    });

    updateFinanceTable();
}

