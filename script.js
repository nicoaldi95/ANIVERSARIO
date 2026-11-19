/* ============================================================================
   1. CONFIGURACIÓN PRINCIPAL (EDITA AQUÍ TUS DATOS Y RUTAS DE LA CARPETA fotos/)
   ============================================================================ */
const CONFIG = {
  pin: "2021", // Contraseña numérica de 4 dígitos para entrar
  pistaPin: "Pista: El año en que comenzó todo",
  fechaInicioRelacion: "2021-11-19T00:00:00", // Inicio de los 5 años
  fechaInicioHogar: "1997-11-19T00:00:00",    // Inicio de Mi Amor
  tuFirma: "Tu Amor",                         // Tu nombre para las firmas

  // Fotos del carrusel ("El Comienzo"). Guarda tus imágenes dentro de la carpeta "fotos/"
  carrusel: [
    {
      img: "fotos/inicio-1.jpg",
      titulo: "Nuestra primera fotografía",
      mensaje: "El día en que el tiempo se detuvo por primera vez para nosotros."
    },
    {
      img: "fotos/inicio-2.jpg",
      titulo: "Las primeras salidas",
      mensaje: "Cuando las horas se pasaban volando entre cafés y miradas cómplices."
    },
    {
      img: "fotos/inicio-3.jpg",
      titulo: "El momento en que lo supe",
      mensaje: "Ahí entendí que lo nuestro no iba a ser algo pasajero, sino una vida entera."
    }
  ],

  // 16 Recuerdos interactivos. Apuntan a "fotos/recuerdo-01.jpg" ... "fotos/recuerdo-16.jpg"
  recuerdos: [
    {
      img: "fotos/carrusel-01.gif",
      titulo: "Mirador entre nubes y agua",
      mensaje: "Sobre las montañas y el agua esmeralda, mirando el horizonte juntos."
    },
    {
      img: "fotos/carrusel-02.jpg",
      titulo: "A orillas del río verde",
      mensaje: "Tu cabeza junto a la mía y la calma del agua reflejando la naturaleza."
    },
    {
      img: "fotos/carrusel-03.jpg",
      titulo: "Noche de luces sobre la ciudad",
      mensaje: "El frío del mirador, miles de luces brillando abajo y nosotros abrigados en una mirada."
    },
    {
      img: "fotos/carrusel-04.jpg",
      titulo: "Frente a la cascada",
      mensaje: "Entre el sonido del agua y el verde del bosque, sintiendo la paz de tenerte cerca."
    },
    {
      img: "fotos/carrusel-05.jpg",
      titulo: "Un café de otro tiempo",
      mensaje: "Un rincón cálido lleno de luces y detalles dorados, perfecto para una tarde contigo."
    },
    {
      img: "fotos/carrusel-06.jpg",
      titulo: "Plaza entre montañas",
      mensaje: "Caminando sobre piedras antiguas, con la montaña verde cuidándonos a lo lejos."
    },
    {
      img: "fotos/carrusel-07.jpg",
      titulo: "Bajo el cielo azul y las torres",
      mensaje: "Días soleados descubriendo lugares hermosos siempre de tu mano."
    },
    {
      img: "fotos/carrusel-08.jpg",
      titulo: "Nuestros momentos cotidianos",
      mensaje: "Esas salidas sencillas donde lo único que importa es compartir un rato juntos."
    },
    {
      img: "fotos/carrusel-09.jpg",
      titulo: "Citas entre risas y cena",
      mensaje: "Noches de comida rica, charlas interminables y tu sonrisa iluminando la mesa."
    },
    {
      img: "fotos/carrusel-10.jpg",
      titulo: "Celebrando la vida juntos",
      mensaje: "Brindando entre luces cálidas, con pastel y la alegría de seguir sumando recuerdos."
    },
    {
      img: "fotos/carrusel-11.jpg",
      titulo: "Aventura sobre dos ruedas",
      mensaje: "Con el cielo azul encima, una flor en tu cabello y las ganas de recorrer el mundo contigo."
    }
  ]
};

/* ============================================================================
   2. ESTADO DE LA APLICACIÓN Y ALMACENAMIENTO TEMPORAL EN NAVEGADOR
   (Permite probar fotos en el navegador sin romper las rutas de la carpeta fotos/)
   ============================================================================ */
const STORAGE_KEY = "nuestra_historia_5y_overrides_v1";
let appState = {
  carrusel: CONFIG.carrusel.map((item) => ({ ...item })),
  recuerdos: CONFIG.recuerdos.map((item) => ({ ...item }))
};

// Carga cambios temporales hechos desde el navegador (fotos subidas o mensajes editados)
function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);

    if (Array.isArray(saved.carrusel)) {
      saved.carrusel.forEach((s, idx) => {
        if (appState.carrusel[idx]) {
          if (s.img && s.img.startsWith("data:")) appState.carrusel[idx].img = s.img;
          if (s.titulo) appState.carrusel[idx].titulo = s.titulo;
          if (s.mensaje) appState.carrusel[idx].mensaje = s.mensaje;
        } else if (idx >= appState.carrusel.length) {
          appState.carrusel.push(s);
        }
      });
    }

    if (Array.isArray(saved.recuerdos)) {
      saved.recuerdos.forEach((r, idx) => {
        if (appState.recuerdos[idx]) {
          if (r.img && r.img.startsWith("data:")) appState.recuerdos[idx].img = r.img;
          if (r.titulo) appState.recuerdos[idx].titulo = r.titulo;
          if (r.mensaje) appState.recuerdos[idx].mensaje = r.mensaje;
        }
      });
    }
  } catch (e) {
    console.warn("No se pudo leer localStorage:", e);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    alert("Se alcanzó el límite temporal del navegador. Guarda las fotos directamente en tu carpeta 'fotos/'.");
  }
}

// Reduce y comprime una imagen subida desde el navegador para previsualizarla rápido
function compressImage(file, maxWidth = 900, quality = 0.78) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ============================================================================
   3. PANTALLA DE BLOQUEO CON PIN
   ============================================================================ */
const lockScreen = document.getElementById("lock-screen");
const mainContent = document.getElementById("main-content");
const pinDisplay = document.getElementById("pin-display");
const pinDots = pinDisplay.querySelectorAll(".pin-dot");
let enteredPin = "";

// Inserta textos personalizados desde CONFIG
document.getElementById("lock-hint-text").textContent = CONFIG.pistaPin;
document.getElementById("signature-display").textContent = CONFIG.tuFirma;
document.getElementById("letter-sign-display").textContent = "Siempre tuyo, " + CONFIG.tuFirma;

function updatePinDots() {
  pinDots.forEach((dot, i) => dot.classList.toggle("filled", i < enteredPin.length));
}

function tryUnlock() {
  if (enteredPin === CONFIG.pin) {
    lockScreen.classList.add("unlocked");
    mainContent.classList.add("visible");
    startMusic();
  } else {
    pinDisplay.classList.add("error");
    setTimeout(() => {
      pinDisplay.classList.remove("error");
      enteredPin = "";
      updatePinDots();
    }, 450);
  }
}

document.querySelectorAll(".key-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.key;
    if (val === "del") {
      enteredPin = enteredPin.slice(0, -1);
    } else if (val === "clear") {
      enteredPin = "";
    } else if (enteredPin.length < 4) {
      enteredPin += val;
      if (enteredPin.length === 4) setTimeout(tryUnlock, 180);
    }
    updatePinDots();
  });
});

document.getElementById("btn-unlock").addEventListener("click", tryUnlock);

/* ============================================================================
   4. CONTROL DE MÚSICA ROMÁNTICA (MP3 + PIANO AMBIENTAL DE RESPALDO)
   ============================================================================ */
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicLabel = document.getElementById("music-label");
let isPlaying = false;
let audioCtx = null;
let synthInterval = null;

// Si no has puesto un archivo musica.mp3 aún, genera notas suaves con Web Audio API
function startAmbientPiano() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();

  const chords = [
    [261.63, 329.63, 392.00, 493.88],
    [220.00, 261.63, 329.63, 392.00],
    [174.61, 220.00, 261.63, 349.23],
    [196.00, 246.94, 293.66, 392.00]
  ];
  let step = 0;

  const playNote = (freq, delay) => {
    if (!isPlaying || !audioCtx) return;
    const now = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 2.5);
  };

  const playArpeggio = () => {
    const chord = chords[step % chords.length];
    chord.forEach((freq, idx) => playNote(freq, idx * 0.45));
    step++;
  };

  playArpeggio();
  synthInterval = setInterval(playArpeggio, 2600);
}

function stopAmbientPiano() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

function startMusic() {
  if (isPlaying) return;
  isPlaying = true;
  musicToggle.classList.add("playing");
  musicLabel.textContent = "Sonando";

  bgMusic.play().catch(() => {
    startAmbientPiano();
  });
}

function pauseMusic() {
  isPlaying = false;
  musicToggle.classList.remove("playing");
  musicLabel.textContent = "Música";
  bgMusic.pause();
  stopAmbientPiano();
}

musicToggle.addEventListener("click", () => {
  if (isPlaying) pauseMusic();
  else startMusic();
});

document.getElementById("btn-start").addEventListener("click", () => {
  if (!isPlaying) startMusic();
});


// Crea un recuadro elegante cuando la foto aún no existe en la carpeta fotos/
function createPlaceholderElement({ title, subtitle, pathHint, small = false, onClick }) {
  const ph = document.createElement("div");
  ph.className = "upload-placeholder";
  ph.innerHTML = `
    <div class="upload-icon" style="${small ? "width:42px; height:42px; font-size:1.1rem;" : ""}">📷</div>
    <div>
      <strong style="font-family:var(--font-serif); color:var(--gold-light); font-size:${small ? "0.95rem" : "1.1rem"};">${title}</strong>
      ${subtitle ? `<p style="font-size:0.84rem; margin-top:3px;">${subtitle}</p>` : ""}
      ${pathHint ? `<div class="placeholder-path">${pathHint}</div>` : ""}
    </div>
  `;
  if (onClick) ph.onclick = onClick;
  return ph;
}

/* ============================================================================
   6. CARRUSEL INTERACTIVO ("EL COMIENZO")
   ============================================================================ */
const carouselTrack = document.getElementById("carousel-track");
const carouselDots = document.getElementById("carousel-dots");
let currentSlide = 0;

function renderCarousel() {
  carouselTrack.innerHTML = "";
  carouselDots.innerHTML = "";

  appState.carrusel.forEach((slide, idx) => {
    const slideEl = document.createElement("div");
    slideEl.className = "carousel-slide";

    const imgBox = document.createElement("div");
    imgBox.className = "carousel-image-box film-photo";

    const showPlaceholder = () => {
      imgBox.innerHTML = "";
      imgBox.appendChild(
        createPlaceholderElement({
          title: `Foto del comienzo #${idx + 1}`,
          subtitle: "Toca aquí para probar una foto o guárdala en tu carpeta:",
          pathHint: slide.img && !slide.img.startsWith("data:") ? slide.img : `fotos/inicio-${idx + 1}.jpg`,
          onClick: () => triggerPhotoUpload({ type: "carousel", index: idx })
        })
      );
    };

    if (slide.img) {
      const img = document.createElement("img");
      img.src = slide.img;
      img.alt = slide.titulo;

      const changeBtn = document.createElement("button");
      changeBtn.className = "slide-change-btn";
      changeBtn.textContent = "📷 Cambiar foto";
      changeBtn.onclick = () => triggerPhotoUpload({ type: "carousel", index: idx });

      // Si el archivo aún no existe en fotos/, muestra el placeholder sin romper el diseño
      img.onerror = showPlaceholder;

      imgBox.appendChild(img);
      imgBox.appendChild(changeBtn);
    } else {
      showPlaceholder();
    }

    const caption = document.createElement("div");
    caption.className = "carousel-caption";
    caption.innerHTML = `<h4>${slide.titulo}</h4><p>${slide.mensaje}</p>`;

    slideEl.appendChild(imgBox);
    slideEl.appendChild(caption);
    carouselTrack.appendChild(slideEl);

    // Puntos inferiores del carrusel
    const dot = document.createElement("button");
    dot.className = "dot" + (idx === currentSlide ? " active" : "");
    dot.ariaLabel = `Ir a foto ${idx + 1}`;
    dot.onclick = () => goToSlide(idx);
    carouselDots.appendChild(dot);
  });

  updateCarouselPosition();
}

function updateCarouselPosition() {
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  carouselDots.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}

function goToSlide(idx) {
  const total = appState.carrusel.length;
  currentSlide = (idx + total) % total;
  updateCarouselPosition();
}

document.getElementById("carousel-prev").addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("carousel-next").addEventListener("click", () => goToSlide(currentSlide + 1));

document.getElementById("btn-add-slide").addEventListener("click", () => {
  const n = appState.carrusel.length + 1;
  appState.carrusel.push({
    img: `fotos/inicio-${n}.jpg`,
    titulo: `Capítulo especial #${n}`,
    mensaje: "Otro instante de nuestro comienzo guardado para siempre."
  });
  saveData();
  currentSlide = appState.carrusel.length - 1;
  renderCarousel();
});

// Soporte para deslizar con el dedo en celulares (swipe)
let touchStartX = 0;
carouselTrack.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselTrack.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 45) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
}, { passive: true });

/* ============================================================================
   7. GALERÍA INTERACTIVA DE LOS 16 RECUERDOS
   ============================================================================ */
const memoriesGrid = document.getElementById("memories-grid");
const memoryModal = document.getElementById("memory-modal");

function renderMemories() {
  memoriesGrid.innerHTML = "";
  appState.recuerdos.forEach((mem, idx) => {
    const card = document.createElement("div");
    card.className = "memory-card";

    const thumb = document.createElement("div");
    thumb.className = "memory-thumb film-photo";

    const badge = document.createElement("span");
    badge.className = "memory-num";
    badge.textContent = `#${String(idx + 1).padStart(2, "0")}`;

    const showCardPlaceholder = () => {
      thumb.innerHTML = "";
      thumb.appendChild(badge);
      thumb.appendChild(
        createPlaceholderElement({
          title: `Foto ${idx + 1}`,
          pathHint: mem.img && !mem.img.startsWith("data:") ? mem.img : "",
          small: true
        })
      );
    };

    thumb.appendChild(badge);
    if (mem.img) {
      const img = document.createElement("img");
      img.src = mem.img;
      img.alt = mem.titulo;
      img.onerror = showCardPlaceholder;
      thumb.appendChild(img);
    } else {
      showCardPlaceholder();
    }

    const meta = document.createElement("div");
    meta.className = "memory-meta";
    meta.innerHTML = `<h4>${mem.titulo}</h4><p>${mem.mensaje}</p>`;

    card.appendChild(thumb);
    card.appendChild(meta);
    card.onclick = () => openMemoryModal(idx);
    memoriesGrid.appendChild(card);
  });
}

function openMemoryModal(idx) {
  currentMemoryIndex = idx;
  const mem = appState.recuerdos[idx];
  const imgWrap = document.getElementById("memory-modal-img-wrap");
  imgWrap.innerHTML = "";

  const showModalPlaceholder = () => {
    imgWrap.innerHTML = "";
    imgWrap.appendChild(
      createPlaceholderElement({
        title: `Recuerdo #${String(idx + 1).padStart(2, "0")}`,
        subtitle: "Toca aquí para cargar la foto o guárdala en tu carpeta:",
        pathHint: mem.img && !mem.img.startsWith("data:") ? mem.img : `fotos/recuerdo-${String(idx + 1).padStart(2, "0")}.jpg`,
        onClick: () => triggerPhotoUpload({ type: "memory", index: idx })
      })
    );
  };

  if (mem.img) {
    const img = document.createElement("img");
    img.src = mem.img;
    img.alt = mem.titulo;
    img.onerror = showModalPlaceholder;
    imgWrap.appendChild(img);
  } else {
    showModalPlaceholder();
  }

  document.getElementById("memory-modal-title").textContent = mem.titulo;
  document.getElementById("memory-modal-text").textContent = mem.mensaje;
  memoryModal.classList.add("open");
}

document.getElementById("close-memory-modal").onclick = () => memoryModal.classList.remove("open");
memoryModal.addEventListener("click", (e) => {
  if (e.target === memoryModal) memoryModal.classList.remove("open");
});

document.getElementById("memory-prev-btn").onclick = () => openMemoryModal((currentMemoryIndex - 1 + 16) % 16);
document.getElementById("memory-next-btn").onclick = () => openMemoryModal((currentMemoryIndex + 1) % 16);
document.getElementById("memory-upload-btn").onclick = () => triggerPhotoUpload({ type: "memory", index: currentMemoryIndex });

document.getElementById("memory-edit-msg-btn").onclick = () => {
  const mem = appState.recuerdos[currentMemoryIndex];
  const nuevoTitulo = prompt("Título del recuerdo:", mem.titulo);
  if (nuevoTitulo !== null && nuevoTitulo.trim() !== "") mem.titulo = nuevoTitulo.trim();
  const nuevoMsg = prompt("Mensaje para esta foto:", mem.mensaje);
  if (nuevoMsg !== null && nuevoMsg.trim() !== "") mem.mensaje = nuevoMsg.trim();
  saveData();
  renderMemories();
  openMemoryModal(currentMemoryIndex);
};

/* ============================================================================
   8. CONTADORES DE TIEMPO EN VIVO (5 AÑOS JUNTOS Y 4 AÑOS DE HOGAR)
   ============================================================================ */
function formatElapsed(startDateStr) {
  const start = new Date(startDateStr).getTime();
  const diff = Math.max(0, Date.now() - start);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, "0");
  return `${String(days).padStart(4, "0")} : ${pad(hours)} : ${pad(mins)} : ${pad(secs)}`;
}

function updateCounters() {
  document.getElementById("counter-relationship").textContent = formatElapsed(CONFIG.fechaInicioRelacion);
  document.getElementById("counter-home").textContent = formatElapsed(CONFIG.fechaInicioHogar);
}

setInterval(updateCounters, 1000);
updateCounters();

/* ============================================================================
   9. MODAL DE LA CARTA
   ============================================================================ */
const letterModal = document.getElementById("letter-modal");
document.getElementById("open-letter-btn").onclick = () => letterModal.classList.add("open");
document.getElementById("close-letter-modal").onclick = () => letterModal.classList.remove("open");
letterModal.addEventListener("click", (e) => {
  if (e.target === letterModal) letterModal.classList.remove("open");
});

/* ============================================================================
   10. ANIMACIONES AL HACER SCROLL Y PARTÍCULAS DORADAS
   ============================================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Dibuja partículas doradas flotando suavemente hacia arriba
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
const particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < 42; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.6,
    vy: -(Math.random() * 0.35 + 0.12),
    vx: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.55 + 0.15
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.y += p.vy;
    p.x += p.vx;
    if (p.y < -10) {
      p.y = canvas.height + 10;
      p.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}

/* ============================================================================
   11. INICIALIZACIÓN AL CARGAR LA PÁGINA
   ============================================================================ */
loadSavedData();
renderCarousel();
renderMemories();
animateParticles();