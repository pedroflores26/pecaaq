// Dados fictícios das empresas
const empresas = [
  { nome: "AutoPrime", segmento: "Distribuidora", cidade: "SP" },
  { nome: "TorqueMax", segmento: "Fabricante", cidade: "PR" },
  { nome: "RodaFácil", segmento: "E-commerce", cidade: "RJ" },
  { nome: "Filtro&Co", segmento: "Fabricante", cidade: "SC" },
  { nome: "TecBrake", segmento: "Tecnologia", cidade: "MG" },
  { nome: "LigaParts", segmento: "Distribuidora", cidade: "RS" },
  { nome: "MotoWay", segmento: "E-commerce", cidade: "BA" },
  { nome: "VolantyX", segmento: "Fabricante", cidade: "SP" },
  { nome: "ShockPro", segmento: "Distribuidora", cidade: "CE" },
  { nome: "EcoLub", segmento: "Fabricante", cidade: "PE" },
  { nome: "BielaTech", segmento: "Tecnologia", cidade: "GO" },
  { nome: "DriveUp", segmento: "E-commerce", cidade: "SP" }
];

// Produtos (duas categorias: carro e moto)
const produtos = [
  { nome: "Pastilha de Freio Dianteira", categoria: "carro", preco: 129.90 },
  { nome: "Filtro de Ar Esportivo", categoria: "carro", preco: 89.50 },
  { nome: "Amortecedor Traseiro", categoria: "carro", preco: 359.00 },
  { nome: "Correia Dentada", categoria: "carro", preco: 149.00 },
  { nome: "Kit Relação 428H", categoria: "moto", preco: 219.90 },
  { nome: "Capacete Fechado (ABS)", categoria: "moto", preco: 349.00 },
  { nome: "Jogo de Raios Inox", categoria: "moto", preco: 119.90 },
  { nome: "Pastilha de Freio Moto", categoria: "moto", preco: 79.90 }
];

// Utilidades
const el = (sel) => document.querySelector(sel);
const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Render Empresas
function renderEmpresas(lista){
  const grid = el("#gridEmpresas");
  grid.innerHTML = "";
  lista.forEach((e) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="logo-wrap">
        <div class="logo">${e.nome.slice(0,2).toUpperCase()}</div>
      </div>
      <div class="card-body">
        <span class="tag">${e.segmento}</span>
        <h4>${e.nome}</h4>
        <p>${e.cidade} • Prazo médio de entrega: 24–48h</p>
        <button class="btn-link" aria-label="Ver perfil">Ver perfil</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Produtos (duas fileiras em grid responsivo)
function renderProdutos(lista){
  const grid = el("#gridProdutos");
  grid.innerHTML = "";
  lista.forEach((p, idx) => {
    const card = document.createElement("article");
    card.className = "card card-product";
    card.innerHTML = `
      <div class="media">
        <div class="logo" aria-hidden="true">${p.categoria === "carro" ? "🚗" : "🏍️"}</div>
      </div>
      <div class="card-body">
        <h4>${p.nome}</h4>
        <p class="price">${fmt(p.preco)}</p>
        <div style="display:flex; gap:8px; margin-top:10px">
          <button class="btn" data-prod="${idx}">Ver ofertas</button>
          <button class="btn-link">Detalhes</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Busca e filtros
el("#buscaEmpresas").addEventListener("input", (ev) => {
  const q = ev.target.value.toLowerCase();
  const filtrada = empresas.filter(e =>
    e.nome.toLowerCase().includes(q) ||
    e.segmento.toLowerCase().includes(q) ||
    e.cidade.toLowerCase().includes(q)
  );
  renderEmpresas(filtrada);
});

el("#buscaProdutos").addEventListener("input", applyFiltroProdutos);
el("#filtroCategoria").addEventListener("change", applyFiltroProdutos);

function applyFiltroProdutos(){
  const q = el("#buscaProdutos").value.toLowerCase();
  const cat = el("#filtroCategoria").value;
  const lista = produtos.filter(p => {
    const okCat = cat === "todos" ? true : p.categoria === cat;
    const okBusca = p.nome.toLowerCase().includes(q);
    return okCat && okBusca;
  });
  renderProdutos(lista);
}

// Modal de ofertas com múltiplos preços
const dialog = document.getElementById("modalOfertas");
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button.btn");
  if(btn && btn.dataset.prod !== undefined){
    const prod = produtos[Number(btn.dataset.prod)];
    abrirOfertas(prod);
  }
  if(e.target.matches(".btn-close")) dialog.close();
});

function abrirOfertas(prod){
  document.getElementById("modalTitulo").textContent = `Ofertas — ${prod.nome}`;
  const lista = document.getElementById("listaOfertas");
  // gera 3 ofertas fictícias
  const ofertas = [
    { loja: "AutoPrime", prazo: "Entrega hoje", valor: prod.preco * 0.98 },
    { loja: "TorqueMax", prazo: "1–2 dias", valor: prod.preco * 0.95 },
    { loja: "RodaFácil", prazo: "2–3 dias", valor: prod.preco * 0.92 },
  ];
  lista.innerHTML = ofertas.map(o => `
    <div class="oferta">
      <div>
        <strong>${o.loja}</strong><br>
        <small>${o.prazo}</small>
      </div>
      <div style="display:flex; align-items:center; gap:10px">
        <strong>${fmt(o.valor)}</strong>
        <button class="btn">Adicionar ao carrinho</button>
      </div>
    </div>
  `).join("");
  dialog.showModal();
}

// Ano no footer
document.getElementById("ano").textContent = new Date().getFullYear();

// Inicialização
renderEmpresas(empresas);
renderProdutos(produtos);
