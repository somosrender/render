/* =========================================================
   render. — script principal
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initPortfolioModal();
  initScrollReveal();
  setFooterYear();
});


/* =========================================================
   MENÚ MOBILE
   ========================================================= */

function initMobileNav() {
  const toggle =
    document.getElementById("nav-toggle");

  const nav =
    document.getElementById("main-nav");

  if (!toggle || !nav) return;

  const desktopBreakpoint = 1024;


  function closeMenu() {
    nav.classList.remove("is-open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.setAttribute(
      "aria-label",
      "Abrir menú"
    );

    document.body.classList.remove(
      "nav-open"
    );
  }


  function openMenu() {
    nav.classList.add("is-open");

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    toggle.setAttribute(
      "aria-label",
      "Cerrar menú"
    );

    document.body.classList.add(
      "nav-open"
    );
  }


  toggle.addEventListener("click", () => {

    const isOpen =
      toggle.getAttribute("aria-expanded")
      === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }

  });


  nav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        nav.classList.contains("is-open")
      ) {

        closeMenu();

        toggle.focus();
      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >
          desktopBreakpoint &&
        nav.classList.contains("is-open")
      ) {
        closeMenu();
      }

    }
  );
}


/* =========================================================
   MODAL PORTFOLIO
   ========================================================= */

function initPortfolioModal() {
  const modal =
    document.getElementById("video-modal");

  const player =
    document.getElementById(
      "video-modal-player"
    );

  const title =
    document.getElementById(
      "video-modal-title"
    );

  const type =
    document.getElementById(
      "video-modal-type"
    );

  const closeButton =
    document.getElementById(
      "video-modal-close"
    );

  const works =
    document.querySelectorAll(
      "[data-video]"
    );


  if (
    !modal ||
    !player ||
    !title ||
    !type ||
    !closeButton ||
    !works.length
  ) {
    return;
  }


  let previousFocus = null;


  function openModal(work) {
    const videoSource =
      work.dataset.video;

    if (!videoSource) return;


    previousFocus =
      document.activeElement;


    title.textContent =
      work.dataset.title ||
      "Proyecto";


    type.textContent =
      work.dataset.type ||
      "Portfolio";


    player.src =
      videoSource;


    player.load();


    modal.classList.add(
      "is-open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "modal-open"
    );


    closeButton.focus();


    const playPromise =
      player.play();


    if (
      playPromise &&
      typeof playPromise.catch ===
        "function"
    ) {
      playPromise.catch(() => {});
    }
  }


  function closeModal() {
    if (
      !modal.classList.contains(
        "is-open"
      )
    ) {
      return;
    }


    player.pause();

    player.removeAttribute("src");

    player.load();


    modal.classList.remove(
      "is-open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "modal-open"
    );


    if (
      previousFocus &&
      typeof previousFocus.focus ===
        "function"
    ) {
      previousFocus.focus();
    }


    previousFocus = null;
  }


  works.forEach((work) => {

    work.addEventListener(
      "click",
      () => openModal(work)
    );

  });


  closeButton.addEventListener(
    "click",
    closeModal
  );


  modal
    .querySelectorAll(
      "[data-modal-close]"
    )
    .forEach((element) => {

      element.addEventListener(
        "click",
        closeModal
      );

    });


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        modal.classList.contains(
          "is-open"
        )
      ) {
        closeModal();
      }

    }
  );
}


/* =========================================================
   REVEAL
   ========================================================= */

function initScrollReveal() {
  const targets =
    document.querySelectorAll(
      "[data-reveal]"
    );

  if (!targets.length) return;


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    targets.forEach((element) => {
      element.classList.add(
        "is-visible"
      );
    });

    return;
  }


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target.classList.add(
              "is-visible"
            );


            observer.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  targets.forEach((element) => {
    observer.observe(element);
  });
}


/* =========================================================
   AÑO
   ========================================================= */

function setFooterYear() {
  const year =
    document.getElementById("year");

  if (!year) return;

  year.textContent =
    new Date().getFullYear();
}