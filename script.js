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
   DETECCIÓN iOS / iPadOS
   ========================================================= */

function isIOSDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const classicIOS =
    /iPad|iPhone|iPod/.test(userAgent);

  /*
    Desde iPadOS 13 algunos iPad pueden identificarse
    como Macintosh.
  */
  const modernIPad =
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1;

  return classicIOS || modernIPad;
}


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
      toggle.getAttribute("aria-expanded") === "true";

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
        window.innerWidth > desktopBreakpoint &&
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
    document.getElementById("video-modal-player");

  const title =
    document.getElementById("video-modal-title");

  const type =
    document.getElementById("video-modal-type");

  const closeButton =
    document.getElementById("video-modal-close");

  const works =
    document.querySelectorAll("[data-video]");


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


  const isiOS = isIOSDevice();

  let previousFocus = null;


  /* ---------------------------------------------------------
     CONFIGURACIÓN DEL VIDEO
     --------------------------------------------------------- */

  player.setAttribute("controls", "");
  player.setAttribute("playsinline", "");
  player.setAttribute("webkit-playsinline", "");
  player.setAttribute("preload", "metadata");

  /*
    Evitamos que Safari intente hacer cosas raras
    con reproducción automática.
  */
  player.autoplay = false;


  /* ---------------------------------------------------------
     LIMPIAR FUENTE
     --------------------------------------------------------- */

  function clearPlayer() {
    player.pause();

    /*
      Eliminamos cualquier <source> anterior.
    */
    while (player.firstChild) {
      player.removeChild(player.firstChild);
    }

    player.removeAttribute("src");

    /*
      Obliga al navegador a liberar el recurso anterior.
    */
    player.load();
  }


  /* ---------------------------------------------------------
     ASIGNAR FUENTE
     --------------------------------------------------------- */

  function setVideoSource(videoSource) {
    clearPlayer();

    const source =
      document.createElement("source");

    source.src = videoSource;

    /*
      Esto es especialmente importante para Safari/iOS.
    */
    source.type = "video/mp4";

    player.appendChild(source);

    player.load();
  }


  /* ---------------------------------------------------------
     ABRIR MODAL
     --------------------------------------------------------- */

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


    /*
      Primero mostramos el modal.
    */
    modal.classList.add("is-open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );


    /*
      Luego asignamos la fuente.
    */
    setVideoSource(videoSource);


    /*
      iOS:
      NO forzamos player.play().

      El toque que abrió el modal ya fue una interacción
      del usuario, pero Safari puede invalidar esa interacción
      después de cargar asincrónicamente el recurso.

      Entonces dejamos el reproductor listo y el usuario
      pulsa Play dentro del reproductor.

      Android / desktop:
      mantenemos reproducción automática como antes.
    */
    if (!isiOS) {
      const playPromise =
        player.play();

      if (
        playPromise &&
        typeof playPromise.catch === "function"
      ) {
        playPromise.catch(() => {});
      }
    }


    /*
      En desktop dejamos foco en cerrar.
      En iOS evitamos mover el foco porque puede interferir
      con la interacción multimedia.
    */
    if (!isiOS) {
      closeButton.focus();
    }
  }


  /* ---------------------------------------------------------
     CERRAR MODAL
     --------------------------------------------------------- */

  function closeModal() {
    if (
      !modal.classList.contains("is-open")
    ) {
      return;
    }


    clearPlayer();


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
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }


    previousFocus = null;
  }


  /* ---------------------------------------------------------
     ABRIR DESDE PORTFOLIO
     --------------------------------------------------------- */

  works.forEach((work) => {
    work.addEventListener(
      "click",
      () => openModal(work)
    );
  });


  /* ---------------------------------------------------------
     CERRAR
     --------------------------------------------------------- */

  closeButton.addEventListener(
    "click",
    closeModal
  );


  modal
    .querySelectorAll("[data-modal-close]")
    .forEach((element) => {
      element.addEventListener(
        "click",
        closeModal
      );
    });


  /* ---------------------------------------------------------
     ESCAPE
     --------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
      ) {
        closeModal();
      }
    }
  );


  /* ---------------------------------------------------------
     DIAGNÓSTICO DEL VIDEO
     --------------------------------------------------------- */

  player.addEventListener(
    "loadedmetadata",
    () => {
      console.log(
        "[Render] Metadata cargada:",
        {
          duration: player.duration,
          width: player.videoWidth,
          height: player.videoHeight,
          ios: isiOS
        }
      );
    }
  );


  player.addEventListener(
    "canplay",
    () => {
      console.log(
        "[Render] El video está listo para reproducirse."
      );
    }
  );


  player.addEventListener(
    "error",
    () => {
      const mediaError =
        player.error;

      console.error(
        "[Render] Error reproduciendo video:",
        {
          ios: isiOS,
          code: mediaError
            ? mediaError.code
            : null,
          message: mediaError
            ? mediaError.message
            : "Sin información adicional"
        }
      );
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
