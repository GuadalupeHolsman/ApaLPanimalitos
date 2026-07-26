(function () {
  'use strict';

  /* --- Menú de navegación (mobile) -------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var navPrincipal = document.getElementById('nav-principal');

  if (navToggle && navPrincipal) {
    navToggle.addEventListener('click', function () {
      var abierto = navPrincipal.classList.toggle('nav-principal--abierta');
      navToggle.setAttribute('aria-expanded', String(abierto));
    });

    navPrincipal.querySelectorAll('.nav-principal__enlace').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        navPrincipal.classList.remove('nav-principal--abierta');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Animaciones al hacer scroll (.reveal) ------------------------------ */
  var elementosReveal = document.querySelectorAll('.reveal');

  if (elementosReveal.length) {
    if ('IntersectionObserver' in window) {
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('reveal--visible');
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.15 });

      elementosReveal.forEach(function (el) { observador.observe(el); });
    } else {
      elementosReveal.forEach(function (el) { el.classList.add('reveal--visible'); });
    }
  }

  /* --- Carrusel de fotos --------------------------------------------------- */
  document.querySelectorAll('.carrusel-fotos').forEach(function (carrusel) {
    var pista = carrusel.querySelector('.carrusel-fotos__pista');
    var slides = carrusel.querySelectorAll('.carrusel-fotos__slide');
    var botonPrev = carrusel.querySelector('[data-carrusel-prev]');
    var botonNext = carrusel.querySelector('[data-carrusel-next]');
    var dots = carrusel.querySelectorAll('[data-carrusel-dot]');

    if (!pista || !slides.length) return;

    var indiceActual = 0;

    function irASlide(indice) {
      indiceActual = (indice + slides.length) % slides.length;
      pista.style.transform = 'translateX(-' + (indiceActual * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', String(i === indiceActual));
      });
    }

    if (botonPrev) botonPrev.addEventListener('click', function () { irASlide(indiceActual - 1); });
    if (botonNext) botonNext.addEventListener('click', function () { irASlide(indiceActual + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { irASlide(i); });
    });

    irASlide(0);
  });

  /* --- Filtros del catálogo de adopción ------------------------------------ */
  var grilla = document.getElementById('grilla-adopcion');
  var barraFiltros = document.getElementById('barra-filtros');
  var botonLimpiar = document.getElementById('limpiar-filtros');

  if (grilla && barraFiltros) {
    var tarjetas = grilla.querySelectorAll('.tarjeta-animal');
    var checks = barraFiltros.querySelectorAll('input[type="checkbox"]');

    function valoresSeleccionados(nombre) {
      return Array.prototype.slice.call(checks)
        .filter(function (c) { return c.name === nombre && c.checked; })
        .map(function (c) { return c.value; });
    }

    function aplicarFiltros() {
      var tamanos = valoresSeleccionados('tamano');
      var edades = valoresSeleccionados('edad');

      tarjetas.forEach(function (tarjeta) {
        var coincideTamano = !tamanos.length || tamanos.indexOf(tarjeta.dataset.tamano) !== -1;
        var coincideEdad = !edades.length || edades.indexOf(tarjeta.dataset.edad) !== -1;
        tarjeta.hidden = !(coincideTamano && coincideEdad);
      });
    }

    checks.forEach(function (check) { check.addEventListener('change', aplicarFiltros); });

    if (botonLimpiar) {
      botonLimpiar.addEventListener('click', function () {
        checks.forEach(function (check) { check.checked = false; });
        aplicarFiltros();
      });
    }
  }
})();
