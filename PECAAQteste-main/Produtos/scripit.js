// Define uma constante para o número de produtos por página.
const PRODUCTS_PER_PAGE = 8;
let currentPage = 1;
let products = [];
let filtered = [];
let brandsSet = new Set();
let categoriesSet = new Set();

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const brandList = document.getElementById('brandList');
    const categoryList = document.getElementById('categoryList');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const showMoreBrands = document.getElementById('showMoreBrands');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const applyPrice = document.getElementById('applyPrice');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');

    createSampleProducts();
    populateFilterSets();
    renderFilterCheckboxes();
    applyFiltersAndRender();

    sortSelect.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    document.querySelectorAll('[data-filter="opportunity"]').forEach(el => el.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); }));

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const q = e.target.value.trim().toLowerCase();
        debounceTimer = setTimeout(() => {
            renderSuggestions(q);
            currentPage = 1;
            applyFiltersAndRender();
        }, 220);
    });

    suggestions.addEventListener('click', (ev) => {
        if (ev.target.matches('li')) {
            searchInput.value = ev.target.textContent;
            suggestions.classList.add('hidden');
            currentPage = 1;
            applyFiltersAndRender();
        }
    });

    brandList.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    categoryList.addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });

    showMoreBrands.addEventListener('click', () => {
        showMoreBrands.dataset.expanded = showMoreBrands.dataset.expanded === '1' ? '0' : '1';
        renderFilterCheckboxes();
    });

    applyPrice.addEventListener('click', () => { currentPage = 1; applyFiltersAndRender(); });

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });

    nextPage.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });

    document.getElementById('whatsappBtn')?.addEventListener('click', () => {
        const url = "https://wa.me/5511999999999?text=Ol%C3%A1%20Pe%C3%A7aAq%2C%20gostaria%20de%20ajuda%20com%20uma%20pe%C3%A7a";
        window.open(url, '_blank');
    });

    let cart = [];
    function addToCart(p) {
        cart.push(p);
        cartCount.textContent = cart.length;
        alert(`Produto "${p.title}" adicionado ao carrinho!`);
    }

    function createSampleProducts() {
        products = [
            { id: 1, title: "Filtro de Ar Honda Civic 2010", brand: "Honda", category: "Filtro", price: 120.00, model: "Civic 2010", image: "img/FiltrodeArHondaCivi2010.jpg", parcels: 3, opportunity: true, addedAt: Date.now() - 1000000 },
            { id: 2, title: "Pastilha de Freio Bosch - Gol 2015", brand: "Bosch", category: "Freios", price: 250.50, model: "Gol 2015", image: "img/PastilhaFreioBoschGol2015.jpg", parcels: 5, opportunity: false, addedAt: Date.now() - 2000000 },
            { id: 3, title: "Óleo Lubrificante Shell 5W30", brand: "Shell", category: "Óleo", price: 95.90, model: "Universal", image: "img/OleoLubrificanteShell5W30.jpg", parcels: 2, opportunity: true, addedAt: Date.now() - 3000000 },
            { id: 4, title: "Bateria Moura 60Ah", brand: "Moura", category: "Bateria", price: 480.00, model: "Universal", image: "img/BateriaMoura60Ah.jpg", parcels: 6, opportunity: false, addedAt: Date.now() - 4000000 },
            { id: 5, title: "Filtro de Óleo Fram", brand: "Fram", category: "Filtro", price: 45.30, model: "Universal", image: "img/FiltrodeOleoFram.jpg", parcels: 1, opportunity: false, addedAt: Date.now() - 5000000 },
            { id: 6, title: "Velas NGK Platinum", brand: "NGK", category: "Velas", price: 78.80, model: "Universal", image: "img/VelasNGKPlatinum.jpg", parcels: 3, opportunity: true, addedAt: Date.now() - 6000000 },
            { id: 7, title: "Correia Dentada Gates", brand: "Gates", category: "Correia", price: 150.00, model: "Universal", image: "img/CorreiaDentadaGates.jpg", parcels: 4, opportunity: false, addedAt: Date.now() - 7000000 },
            { id: 8, title: "Amortecedor Monroe", brand: "Monroe", category: "Suspensão", price: 350.00, model: "Universal", image: "img/AmortecedorMonroe.jpg", parcels: 5, opportunity: true, addedAt: Date.now() - 8000000 },
            { id: 9, title: "Filtro de Combustível Fram", brand: "Fram", category: "Filtro", price: 60.00, model: "Universal", image: "img/FiltrodeCombustivelFram.jpg", parcels: 3, opportunity: false, addedAt: Date.now() - 9000000 },
            { id: 10, title: "Pastilha de Freio Bosch - Corolla 2016", brand: "Bosch", category: "Freios", price: 260.00, model: "Corolla 2016", image: "img/PastilhadeFreioBosch-Corolla2016.jpg", parcels: 5, opportunity: true, addedAt: Date.now() - 10000000 }
        ];
    }

    function populateFilterSets() {
        brandsSet.clear();
        categoriesSet.clear();
        products.forEach(p => {
            brandsSet.add(p.brand);
            categoriesSet.add(p.category);
        });
    }

    function renderFilterCheckboxes() {
        const brandsArr = Array.from(brandsSet).sort();
        const expanded = showMoreBrands.dataset.expanded === '1';
        const limit = expanded ? brandsArr.length : 5;
        brandList.innerHTML = '';
        brandsArr.slice(0, limit).forEach(brand => {
            const id = `brand_${brand.replace(/\W/g, '')}`;
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${brand}" id="${id}"> ${brand}`;
            brandList.appendChild(label);
        });
        showMoreBrands.textContent = expanded ? 'Ver menos' : 'Ver mais';

        const categoriesArr = Array.from(categoriesSet).sort();
        categoryList.innerHTML = '';
        categoriesArr.forEach(cat => {
            const id = `cat_${cat.replace(/\W/g, '')}`;
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${cat}" id="${id}"> ${cat}`;
            categoryList.appendChild(label);
        });
    }

    function renderSuggestions(query) {
        if (!query) { suggestions.classList.add('hidden'); suggestions.innerHTML = ''; return; }
        const matches = products.filter(p => (`${p.title} ${p.brand} ${p.model} ${p.category}`.toLowerCase()).includes(query)).slice(0, 6);
        if (matches.length === 0) { suggestions.classList.add('hidden'); suggestions.innerHTML = ''; return; }
        suggestions.innerHTML = matches.map(p => `<li>${p.title}</li>`).join('');
        suggestions.classList.remove('hidden');
    }

    function applyFiltersAndRender() {
        const q = searchInput.value.trim().toLowerCase();
        const selectedBrands = Array.from(brandList.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
        const selectedCats = Array.from(categoryList.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
        const onlyOpportunity = !!document.querySelector('[data-filter="opportunity"]:checked');
        const minP = parseFloat(priceMin.value) || 0;
        const maxP = parseFloat(priceMax.value) || Infinity;

        filtered = products.filter(p => {
            if (onlyOpportunity && !p.opportunity) return false;
            if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
            if (selectedCats.length && !selectedCats.includes(p.category)) return false;
            if (p.price < minP || p.price > maxP) return false;
            if (q) {
                const hay = `${p.title} ${p.brand} ${p.model} ${p.category}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        const sort = sortSelect.value;
        if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sort === 'recent') filtered.sort((a, b) => b.addedAt - a.addedAt);
        else if (sort === 'relevance') filtered.sort(() => 0.5 - Math.random());

        currentPage = 1;
        renderProducts();
    }

    function renderProducts() {
        productsGrid.innerHTML = '';
        productsCount.textContent = filtered.length;
        const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const slice = filtered.slice(start, start + PRODUCTS_PER_PAGE);
        const tpl = document.getElementById('productCardTpl');

        if (slice.length === 0) {
            productsGrid.innerHTML = `<div style="padding:20px;background:#fff;border-radius:10px;border:1px solid #eee;text-align:center;">Nenhum produto encontrado</div>`;
            return;
        }

        slice.forEach(p => {
            const node = tpl.content.cloneNode(true);
            const article = node.querySelector('.product-card');
            article.querySelector('img').src = p.image;
            article.querySelector('img').alt = p.title;
            article.querySelector('.product-title').textContent = p.title;
            article.querySelector('.price-value').textContent = p.price.toFixed(2).replace('.', ',');
            article.querySelector('.installments').textContent = `Em até ${p.parcels}x R$ ${(p.price / p.parcels).toFixed(2).replace('.', ',')} sem juros`;

            // Clique no card inteiro leva à página de compra
            article.addEventListener('click', (ev) => {
                if (!ev.target.classList.contains('buy-btn')) {
                    window.location.href = "../Comprar/index.html";
                }
            });

            // Clique no botão comprar adiciona ao carrinho e leva à página de compra
            const buyBtn = article.querySelector('.buy-btn');
            buyBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                addToCart(p);
                window.location.href = "../Comprar/index.html"; // <-- redireciona ao clicar
            });

            productsGrid.appendChild(node);
        });
    }
});
