const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// --- БАЗА ДАННЫХ ТОВАРОВ ---
const products = [
    // Футболки
    { id: 1, category: 't-shirts', name: 'Черная футболка', price: '1 500 ₽', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 2, category: 't-shirts', name: 'Белая базовая', price: '1 200 ₽', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
    { id: 3, category: 't-shirts', name: 'Оверсайз футболка', price: '1 800 ₽', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400' },
    
    // Худи
    { id: 4, category: 'hoodies', name: 'Серое худи', price: '3 500 ₽', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
    { id: 5, category: 'hoodies', name: 'Худи с принтом', price: '3 800 ₽', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400' },
    { id: 6, category: 'hoodies', name: 'Зип-худи черное', price: '4 200 ₽', img: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400' },
    
    // Куртки
    { id: 7, category: 'jackets', name: 'Куртка оверсайз', price: '5 000 ₽', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
    { id: 8, category: 'jackets', name: 'Кожаная куртка', price: '8 500 ₽', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    
    // Штаны
    { id: 9, category: 'pants', name: 'Джинсы прямые', price: '3 200 ₽', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { id: 10, category: 'pants', name: 'Спортивные штаны', price: '2 500 ₽', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400' }
];

// --- ЛОГИКА МЕНЮ ---
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

// Открытие/закрытие меню
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

// Закрытие меню при клике в любом другом месте
document.body.addEventListener('click', () => {
    if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
    }
});

// --- ОТРИСОВКА ТОВАРОВ ---
const grid = document.getElementById('productGrid');
const categoryTitle = document.getElementById('categoryTitle');

function renderProducts(category) {
    grid.innerHTML = ''; // Очищаем сетку
    
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Товаров пока нет.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <button class="buy-btn" onclick="addToCart('${product.name}')">В корзину</button>
        `;
        grid.appendChild(card);
    });
}

// Фильтрация по категориям
function filterCategory(category) {
    tg.HapticFeedback.impactOccurred('light');
    dropdownMenu.classList.remove('show');
    
    // Меняем заголовок в зависимости от выбора
    const titles = {
        'all': 'Все товары',
        't-shirts': 'Футболки',
        'hoodies': 'Худи',
        'jackets': 'Куртки',
        'pants': 'Штаны'
    };
    
    categoryTitle.innerText = titles[category] || 'Каталог';
    renderProducts(category);
}

// Кнопка купить
function addToCart(productName) {
    tg.HapticFeedback.impactOccurred('success');
    tg.sendData(JSON.stringify({ action: 'add_to_cart', product: productName }));
    alert(productName + " добавлена в корзину!");
}

// Контакты в меню
function showContacts(event) {
    event.preventDefault();
    tg.HapticFeedback.notificationOccurred('warning');
    alert("Наш телефон: +7 (999) 123-45-67\nTelegram: @admin_username");
    dropdownMenu.classList.remove('show');
}

// Отправка пожеланий
function sendFeedback() {
    const text = document.getElementById('feedbackText').value;
    if (!text.trim()) return alert("Напишите что-нибудь!");
    
    tg.HapticFeedback.notificationOccurred('success');
    tg.sendData(JSON.stringify({ action: 'feedback', text: text }));
    
    document.getElementById('feedbackText').value = '';
    alert("Спасибо за отзыв! Мы обязательно его прочитаем.");
}

// Инициализация (показываем все товары при загрузке)
renderProducts('all');

// --- СКРЫТИЕ ЛОАДЕРА ---
// Ждем, пока загрузятся все картинки и элементы страницы
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden'); // Плавно скрываем
    
    // Полностью удаляем элемент из DOM через 500мс (после завершения анимации)
    setTimeout(() => {
        loader.remove();
    }, 500);
});