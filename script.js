/* =========================================================
   render. — script principal
   Solo lo estrictamente necesario: menú móvil, reveal on
   scroll, año del footer y feedback básico del formulario.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  setFooterYear();
  initContactForm();
});

/* ---------- Menú móvil ---------- */
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("nav-open", isOpen);
  });

  // Cerrar el menú al elegir un link (mejor experiencia en mobile/tablet)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });

  // Si el usuario gira el dispositivo o agranda la ventana y el
  // menú deja de ser hamburguesa, nos aseguramos de resetear el estado
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

/* ---------- Animación de aparición al hacer scroll ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  // Si el usuario prefiere menos movimiento, mostramos todo directo
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Año dinámico en el footer ---------- */
function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------- Formulario de contacto ----------
   No hay backend conectado todavía: esto solo evita que la
   página recargue y muestra un mensaje de confirmación.
   Para que el formulario envíe emails de verdad, conectá
   el <form> a un servicio como Formspree o a tu propio
   endpoint, y quitá el preventDefault de acá.
------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent =
      "Formulario sin conectar todavía: sumá un servicio de envío (ej. Formspree) para que llegue a tu email.";
  });
}