// Utilidades
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

// Ano no footer
$("#year").textContent = new Date().getFullYear();

// Menu mobile
const toggle = $(".nav__toggle");
const nav = $(".nav");
if (toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.style.display === "flex";
    nav.style.display = open ? "none" : "flex";
    toggle.setAttribute("aria-expanded", String(!open));
  });
}

// --------------- Carrossel HERO (automático + botões) ---------------
(function initHero(){
  const track = document.querySelector('[data-carousel="hero"]');
  if (!track) return;
  const slides = $$(".hero__slide", track);
  const dotsWrap = $("[data-dots]");
  let index = 0, timer;
  const setIndex = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    // dots
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, n) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", `Ir ao slide ${n+1}`);
        if (n === index) b.setAttribute("aria-current", "true");
        b.addEventListener("click", () => setIndex(n));
        dotsWrap.appendChild(b);
      });
    }
  };

  const next = () => setIndex(index + 1);
  const prev = () => setIndex(index - 1);

  // Botões
  $("[data-next]")?.addEventListener("click", next);
  $("[data-prev]")?.addEventListener("click", prev);

  // Auto-play (pausa quando usuário interage)
  const start = () => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(next, 5000);
  };
  const stop = () => clearInterval(timer);
  track.addEventListener("pointerdown", stop);
  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", start);

  setIndex(0); start();
})();

// --------------- Carrossel Cards (scroll horizontal com botões) ---------------
(function initCards(){
  const container = document.querySelector('[data-carousel="cards"]');
  if (!container) return;
  const prevBtn = document.querySelector('button[data-prev="#cards"]');
  const nextBtn = document.querySelector('button[data-next="#cards"]');
  const step = () => container.clientWidth * 0.9;

  nextBtn?.addEventListener("click", () => container.scrollBy({ left: +step(), behavior: "smooth" }));
  prevBtn?.addEventListener("click", () => container.scrollBy({ left: -step(), behavior: "smooth" }));
})();

// --------------- Modal: "vários mesmos produtos com preços diferentes" ---------------
const ofertasExemplo = [
  { loja: "Distribuidora Alfa", prazo: "Entrega 24h", preco: 329.90 },
  { loja: "Auto Peças Beta", prazo: "Retirada hoje", preco: 315.50 },
  { loja: "Fornec. Gamma", prazo: "Envio em 48h", preco: 339.00 },
  { loja: "Loja Delta", prazo: "Entrega expressa", preco: 349.90 }
];

const modal = $("#modal-ofertas");
const list = $("#offers-list");
$$("[data-open-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    list.innerHTML = "";
    ofertasExemplo.forEach(o => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>${o.loja}</strong> • <small>${o.prazo}</small></span>
        <span class="offer__price">R$ ${o.preco.toFixed(2)}</span>
        <button class="btn btn--primary">Adicionar ao carrinho</button>
      `;
      list.appendChild(li);
    });
    modal.showModal();
  });
});

// Fechar modal com o X ou ESC
$(".modal__close")?.addEventListener("click", () => modal.close());

// Acessibilidade extra: fecha ao clicar fora do conteúdo
modal?.addEventListener("click", (e) => {
  const dialogRect = modal.getBoundingClientRect();
  if (
    e.clientX < dialogRect.left || e.clientX > dialogRect.right ||
    e.clientY < dialogRect.top  || e.clientY > dialogRect.bottom
  ) modal.close();
});
