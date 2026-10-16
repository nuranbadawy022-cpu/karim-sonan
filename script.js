/* ==========================================================
   EDIT YOUR DETAILS HERE — this is the only part you need to change
   ========================================================== */
const CONFIG = {
  groom: "Karim",
  bride: "Sonan",
  date: "2026-12-26",                      // YYYY-MM-DD (no time is shown; countdown ends at midnight)
  hall: "Tobaz Hall",
  resort: "Ain Alhayat Resort",
  mapsUrl: "https://maps.app.goo.gl/AVTnjFWsRC2EPLhs6",
  musicPath: "assets/music.mp3"            // put your song file here and name it music.mp3
};
/* ========================================================== */

(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [Y, M, D] = CONFIG.date.split("-").map(Number);
  const target = new Date(Y, M - 1, D, 0, 0, 0);
  const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase();

  document.querySelectorAll('[data-bind="groom"]').forEach((e) => (e.textContent = CONFIG.groom));
  document.querySelectorAll('[data-bind="bride"]').forEach((e) => (e.textContent = CONFIG.bride));
  document.title = CONFIG.groom + " & " + CONFIG.bride + " — Wedding Invitation";
  $("dDate").textContent = D + " " + titleCase(MONTHS[M - 1]) + " " + Y;
  $("dHall").textContent = CONFIG.hall;
  $("dResort").textContent = CONFIG.resort;
  $("mapsLink").href = CONFIG.mapsUrl;

  // Music
  const audio = $("bgMusic"), musicBtn = $("musicBtn");
  let musicOk = true;
  audio.addEventListener("error", () => {
    musicOk = false;
    musicBtn.classList.add("disabled");
    musicBtn.setAttribute("aria-label", "Music file not added yet");
  });
  audio.src = CONFIG.musicPath;
  function setPlaying(on) {
    musicBtn.classList.toggle("playing", on);
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  function playMusic() {
    if (!musicOk) return;
    const p = audio.play();
    if (p && p.then) p.then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  musicBtn.addEventListener("click", () => {
    if (!musicOk) return;
    if (audio.paused) playMusic(); else { audio.pause(); setPlaying(false); }
  });

  // Envelope
  const env = $("envelope");
  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    env.classList.add("open");
    musicBtn.hidden = false;
    playMusic(); // allowed: triggered by a tap
    setTimeout(() => {
      document.body.classList.remove("locked");
      env.setAttribute("aria-hidden", "true");
      window.scrollTo(0, 0);
    }, reduce ? 50 : 1100);
  }
  $("openBtn").addEventListener("click", openEnvelope);

  // Reveal on scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    items.forEach((i) => io.observe(i));
  } else items.forEach((i) => i.classList.add("in"));

  // Countdown
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = target - new Date();
    if (diff <= 0) { $("countdown").hidden = true; $("cdDone").hidden = false; return false; }
    const s = Math.floor(diff / 1000);
    $("cdD").textContent = pad(Math.floor(s / 86400));
    $("cdH").textContent = pad(Math.floor((s % 86400) / 3600));
    $("cdM").textContent = pad(Math.floor((s % 3600) / 60));
    $("cdS").textContent = pad(s % 60);
    return true;
  }
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }

  // Back to top
  $("toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
})();
