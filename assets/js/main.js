const cars = [
  { name: "Sedán Elite 2024", type: "sedan", icon: "🚘", price: "$21,500", meta: "2024 · Automático · 12,000 km", badge: "Nuevo" },
  { name: "SUV Explorer 2023", type: "suv", icon: "🚙", price: "$28,900", meta: "2023 · 4x4 · 18,500 km", badge: "Certificado" },
  { name: "Pickup Titan 2022", type: "pickup", icon: "🛻", price: "$32,200", meta: "2022 · Diésel · 25,000 km", badge: "Usado" },
  { name: "Sedán Comfort 2021", type: "sedan", icon: "🚗", price: "$16,800", meta: "2021 · Manual · 40,000 km", badge: "Usado" },
  { name: "SUV Highland 2024", type: "suv", icon: "🚐", price: "$34,700", meta: "2024 · Híbrido · 5,000 km", badge: "Nuevo" },
  { name: "Pickup Ranger 2023", type: "pickup", icon: "🚚", price: "$29,900", meta: "2023 · 4x2 · 15,000 km", badge: "Certificado" },
];

const carGrid = document.getElementById("carGrid");

function renderCars(filter) {
  carGrid.innerHTML = "";
  const filtered = filter === "all" ? cars : cars.filter((c) => c.type === filter);
  filtered.forEach((car) => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-media">
        <span class="car-badge">${car.badge}</span>
        <span>${car.icon}</span>
      </div>
      <div class="car-body">
        <h3>${car.name}</h3>
        <div class="car-meta">${car.meta}</div>
        <div class="car-price">${car.price}</div>
        <a href="#contacto" class="btn btn-primary">Consultar</a>
      </div>
    `;
    carGrid.appendChild(card);
  });
}

renderCars("all");

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderCars(btn.dataset.filter);
});

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => nav.classList.remove("open"))
);

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formStatus.textContent = "¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.";
  contactForm.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
