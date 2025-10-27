// Zoom imagem produto
const produtoImg = document.querySelector(".produto-imagem img");

produtoImg.addEventListener("mousemove", function (e) {
  const { left, top, width, height } = this.getBoundingClientRect();
  const x = ((e.pageX - left) / width) * 100;
  const y = ((e.pageY - top) / height) * 100;

  this.style.transformOrigin = `${x}% ${y}%`;
  this.style.transform = "scale(2)";
});

produtoImg.addEventListener("mouseleave", function () {
  this.style.transformOrigin = "center center";
  this.style.transform = "scale(1)";
});

// Modal pagamento e métodos
const modal = document.getElementById("modal-pagamento");
const fechar = document.getElementById("fechar");
const btnFinalizar = document.getElementById("btn-finalizar");
const metodos = document.querySelectorAll(".metodo");
const formCartao = document.getElementById("pagamento-cartao");
const formPix = document.getElementById("pagamento-pix");

btnFinalizar.addEventListener("click", () => {
  modal.classList.add("show");
  formCartao.classList.add("hidden");
  formPix.classList.add("hidden");
});

fechar.addEventListener("click", () => {
  modal.classList.remove("show");
  formCartao.classList.add("hidden");
  formPix.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    formCartao.classList.add("hidden");
    formPix.classList.add("hidden");
  }
});

metodos.forEach((botao) => {
  botao.addEventListener("click", () => {
    formCartao.classList.add("hidden");
    formPix.classList.add("hidden");
    if (botao.dataset.metodo === "cartao") {
      formCartao.classList.remove("hidden");
    } else {
      formPix.classList.remove("hidden");
    }
  });
});

// Calcular frete baseado no CEP (simulado)
document.getElementById("btn-frete").addEventListener("click", () => {
  const cep = document.getElementById("cep").value.trim();

  if (!cep.match(/^\d{8}$/)) {
    alert("Por favor, digite um CEP válido com 8 números.");
    return;
  }

  const cepNum = parseInt(cep, 10);

  let frete = 0;
  let prazo = 0;

  if (cepNum >= 1000000 && cepNum <= 9999999) {
    frete = 15;
    prazo = 1;
  } else if (cepNum >= 10000000 && cepNum <= 19999999) {
    frete = 25;
    prazo = 2;
  } else if (cepNum >= 20000000 && cepNum <= 29999999) {
    frete = 30;
    prazo = 3;
  } else {
    frete = 50;
    prazo = 5;
  }

  const endereco = "Rua dos Trabalhadores, 123, Bairro Popular, Cidade esteio";

  alert(
    `Frete: R$ ${frete.toFixed(2)}\n` +
    `Prazo de entrega: ${prazo} dia(s)\n` +
    `Endereço: ${endereco}`
  );
});

// Carrossel
document.querySelectorAll('.carrossel').forEach(carrossel => {
  const track = carrossel.querySelector('.carrossel-track');
  const dotsContainer = carrossel.querySelector('.carrossel-dots');
  const cardWidth = 240; // largura do card + margem
  const cardsPerPage = 5;
  const totalCards = track.children.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  let currentPage = 0;

  // Cria as bolinhas
  for(let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);

    dot.addEventListener('click', () => {
      currentPage = i;
      updateCarousel();
    });
  }

  function updateCarousel() {
    const moveX = -currentPage * cardsPerPage * cardWidth;
    track.style.transform = `translateX(${moveX}px)`;
    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  }
});

// Avaliações com estrelas
const MAX_ESTRELAS = 5;
const listaAvaliacoes = document.getElementById('avaliacoes-lista');
const formAvaliacao = document.getElementById('form-avaliacao');
const nomeInput = document.getElementById('nome');
const comentarioInput = document.getElementById('comentario');
const estrelaContainer = document.getElementById('estrela-container');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const formTitle = document.getElementById('form-title');

let avaliacoes = [];
let editIndex = null;

function criarEstrelasFormulario() {
  estrelaContainer.innerHTML = '';
  for (let i = 1; i <= MAX_ESTRELAS; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.dataset.value = i;
    star.textContent = '⭐';
    estrelaContainer.appendChild(star);
  }
}

criarEstrelasFormulario();

let estrelaSelecionada = 0;

estrelaContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('star')) {
    estrelaSelecionada = parseInt(e.target.dataset.value);
    atualizarEstrelasSelecionadas(estrelaSelecionada);
  }
});

function atualizarEstrelasSelecionadas(num) {
  const stars = estrelaContainer.querySelectorAll('.star');
  stars.forEach(star => star.classList.remove('selected'));
  for (let i = 0; i < num; i++) {
    stars[i].classList.add('selected');
  }
}

function renderizarAvaliacoes() {
  listaAvaliacoes.innerHTML = '';
  avaliacoes.forEach((avaliacao, index) => {
    const item = document.createElement('div');
    item.classList.add('avaliacao-item');
    const estrelasHTML = '⭐'.repeat(avaliacao.estrela);
    item.innerHTML = `
      <div class="nome">${avaliacao.nome}</div>
      <div class="estrelas">${estrelasHTML}</div>
      <div class="comentario">${avaliacao.comentario}</div>
      <button class="alterar-btn">Alterar</button>
    `;

    const btnAlterar = item.querySelector('.alterar-btn');
    btnAlterar.addEventListener('click', () => iniciarAlteracao(index));

    listaAvaliacoes.appendChild(item);
  });
}

function iniciarAlteracao(index) {
  const avaliacao = avaliacoes[index];
  nomeInput.value = avaliacao.nome;
  comentarioInput.value = avaliacao.comentario;
  editIndex = index;
  formTitle.textContent = 'Alterar Avaliação';
  btnSubmit.textContent = 'Salvar Alteração';
  btnCancel.style.display = 'block';

  estrelaSelecionada = avaliacao.estrela;
  atualizarEstrelasSelecionadas(estrelaSelecionada);
}

btnCancel.addEventListener('click', () => {
  resetarFormulario();
});

function resetarFormulario() {
  formAvaliacao.reset();
  editIndex = null;
  formTitle.textContent = 'Deixe sua avaliação';
  btnSubmit.textContent = 'Enviar Avaliação';
  btnCancel.style.display = 'none';
  estrelaSelecionada = 0;
  atualizarEstrelasSelecionadas(0);
}

formAvaliacao.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const comentario = comentarioInput.value.trim();

  if (!nome || !comentario || estrelaSelecionada === 0) {
    alert('Por favor, preencha todos os campos e selecione a nota.');
    return;
  }

  const novaAvaliacao = { nome, comentario, estrela: estrelaSelecionada };

  if (editIndex !== null) {
    avaliacoes[editIndex] = novaAvaliacao;
  } else {
    avaliacoes.push(novaAvaliacao);
  }

  renderizarAvaliacoes();
  resetarFormulario();
});

renderizarAvaliacoes();

// Pagamento e endereço
const btnCartao = document.querySelector('#pagamento-cartao .btn-comprar');
const btnPix = document.querySelector('#pagamento-pix .btn-comprar');

const modalEndereco = document.getElementById('modal-endereco');
const fecharEndereco = document.getElementById('fechar-endereco');
const formEndereco = document.getElementById('form-endereco');

function abrirModalEndereco() {
  modalEndereco.classList.add('show');
}

fecharEndereco.addEventListener('click', () => {
  modalEndereco.classList.remove('show');
});

btnCartao.addEventListener('click', (e) => {
  e.preventDefault();
  abrirModalEndereco();
});

btnPix.addEventListener('click', (e) => {
  e.preventDefault();
  abrirModalEndereco();
});

formEndereco.addEventListener('submit', (e) => {
  e.preventDefault();

  const rua = document.getElementById('rua').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const cepEndereco = document.getElementById('cep-endereco').value.trim();

  if (!rua || !numero || !bairro || !cidade || !cepEndereco) {
    alert('Por favor, preencha todos os campos do endereço.');
    return;
  }

  modalEndereco.classList.remove('show');
  modal.classList.remove('show');

  mostrarSucesso();
});

const modalSucesso = document.getElementById('modal-sucesso');
const fecharSucesso = document.getElementById('fechar-sucesso');
const btnFecharSucesso = document.getElementById('btn-fechar-sucesso');
const codigoRastreioSpan = document.getElementById('codigo-rastreio');

function gerarCodigoRastreio() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';

  function randChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  let codigo = '';
  codigo += randChar(letras);
  codigo += randChar(letras);

  for (let i = 0; i < 9; i++) {
    codigo += randChar(numeros);
  }

  codigo += randChar(letras);
  codigo += randChar(letras);

  return codigo;
}

function mostrarSucesso() {
  const codigo = gerarCodigoRastreio();
  codigoRastreioSpan.textContent = codigo;
  modalSucesso.classList.add('show');
}

fecharSucesso.addEventListener('click', () => {
  modalSucesso.classList.remove('show');
});

btnFecharSucesso.addEventListener('click', () => {
  modalSucesso.classList.remove('show');
});

  const filterBtn = document.querySelector(".filter-btn");
  const filterDropdown = document.querySelector(".filter-dropdown");

  filterBtn.addEventListener("click", () => {
    filterDropdown.style.display =
      filterDropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
      filterDropdown.style.display = "none";
    }
  });

  document.querySelector(".apply-filters").addEventListener("click", () => {
    const carro = document.getElementById("filtro-carro").value;
    const modelo = document.getElementById("filtro-modelo").value;
    const peca = document.getElementById("filtro-peca").value;

    alert(`Filtrando: ${carro} | ${modelo} | ${peca}`);
    // Aqui você pode integrar com a lógica real de filtragem
  });

// ======== CARRINHO ======== //
const btnCarrinho = document.getElementById("btnCarrinho");
const carrinhoModal = document.getElementById("carrinhoModal");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const listaCarrinho = document.getElementById("listaCarrinho");
const qtdCarrinho = document.getElementById("qtdCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");

let carrinho = [];

// Abre o carrinho
btnCarrinho.addEventListener("click", () => {
  carrinhoModal.style.display = "block";
});

// Fecha o carrinho
fecharCarrinho.addEventListener("click", () => {
  carrinhoModal.style.display = "none";
});

// Clicar fora fecha também
window.addEventListener("click", (e) => {
  if (e.target == carrinhoModal) carrinhoModal.style.display = "none";
});

// Adicionar produto
document.querySelectorAll(".btn-adicionar").forEach(btn => {
  btn.addEventListener("click", () => {
    const nome = btn.dataset.nome;
    const preco = parseFloat(btn.dataset.preco);

    carrinho.push({ nome, preco });
    atualizarCarrinho();
  });
});

// Atualiza carrinho
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, i) => {
    total += item.preco;
    let li = document.createElement("li");
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    listaCarrinho.appendChild(li);
  });

  qtdCarrinho.textContent = carrinho.length;
  totalCarrinho.textContent = total.toFixed(2);
}
let carrinhoCount = 0;

// ao clicar no botão "Adicionar ao Carrinho"
document.getElementById("add-to-cart").addEventListener("click", function() {
  carrinhoCount++;
  document.getElementById("cart-count").innerText = carrinhoCount;
  alert("Produto adicionado ao carrinho!");
});
