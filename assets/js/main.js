const API_BASE = window.CRM_API_BASE || "";
const carGrid = document.getElementById("carGrid");
const inventoryStatus = document.getElementById("inventoryStatus");

let vehicles = [];
let currentSort = "recent";

function formatPrice(price) {
  if (!price) return "Consultar precio";
  return `$${Number(price).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatMeta(v) {
  const parts = [v.year, v.color, v.mileage ? `${Number(v.mileage).toLocaleString("en-US")} mi` : null].filter(Boolean);
  return parts.join(" · ");
}

function sortVehicles(list, sort) {
  const sorted = [...list];
  if (sort === "price-asc") sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === "price-desc") sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
  return sorted;
}

function renderVehicles() {
  const list = sortVehicles(vehicles, currentSort);
  carGrid.innerHTML = "";

  if (list.length === 0) {
    carGrid.innerHTML = `<p class="inventory-status">Por el momento no hay vehículos publicados. <a href="#contacto">Contáctanos</a> y te avisamos apenas tengamos algo para ti.</p>`;
    return;
  }

  list.forEach((v) => {
    const card = document.createElement("div");
    card.className = "car-card";
    const photo = v.photos && v.photos[0] ? `${API_BASE}${v.photos[0]}` : null;
    const title = `${v.year || ""} ${v.make || ""} ${v.model || ""}`.trim();

    card.innerHTML = `
      <div class="car-media" ${photo ? `style="background-image:url('${photo}');background-size:cover;background-position:center;"` : ""}>
        ${v.title_status && v.title_status.toLowerCase() !== "clean" ? `<span class="car-badge">${v.title_status}</span>` : ""}
        ${photo ? "" : "<span>🚗</span>"}
      </div>
      <div class="car-body">
        <h3>${title}</h3>
        <div class="car-meta">${formatMeta(v)}</div>
        <div class="car-price">${formatPrice(v.price)}</div>
        <a href="#contacto" class="btn btn-primary consultar-btn" data-vehicle="${title}">Consultar</a>
      </div>
    `;
    carGrid.appendChild(card);
  });
}

async function loadVehicles() {
  if (!API_BASE) {
    inventoryStatus.textContent = "El inventario no está disponible en este momento.";
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/public/vehicles`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    vehicles = data.vehicles || [];
    renderVehicles();
  } catch (err) {
    carGrid.innerHTML = `<p class="inventory-status">No pudimos cargar el inventario en este momento. <a href="#contacto">Contáctanos</a> y te ayudamos directamente.</p>`;
    console.error("Error cargando inventario:", err);
  }
}

loadVehicles();

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentSort = btn.dataset.sort;
  renderVehicles();
});

carGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".consultar-btn");
  if (!btn) return;
  const interesField = document.querySelector('[name="message"]');
  if (interesField && !interesField.value) {
    interesField.value = `Me interesa: ${btn.dataset.vehicle}`;
  }
});

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => nav.classList.remove("open"))
);

const simPrice = document.getElementById("simPrice");
const simDown = document.getElementById("simDown");
const simTerm = document.getElementById("simTerm");
const simResult = document.getElementById("simResult");
const ANNUAL_RATE = 0.12;

function updateSimulation() {
  const price = parseFloat(simPrice.value) || 0;
  const downPct = parseFloat(simDown.value) || 0;
  const months = parseInt(simTerm.value, 10) || 1;

  const financedAmount = price * (1 - downPct / 100);
  const monthlyRate = ANNUAL_RATE / 12;
  const payment =
    monthlyRate === 0
      ? financedAmount / months
      : (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  simResult.textContent = `$${Math.max(payment, 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

[simPrice, simDown, simTerm].forEach((el) => el.addEventListener("input", updateSimulation));
updateSimulation();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  formStatus.textContent = "Enviando...";

  const payload = {
    nombre: contactForm.name.value,
    email: contactForm.email.value,
    telefono: contactForm.phone.value,
    interes: contactForm.message.value,
  };

  try {
    if (!API_BASE) throw new Error("API_BASE no configurado");
    const res = await fetch(`${API_BASE}/api/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    formStatus.textContent = "¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.";
    contactForm.reset();
  } catch (err) {
    formStatus.textContent = "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directamente.";
    console.error("Error enviando lead:", err);
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
