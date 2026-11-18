/* ============================================================
   MOTOR DEL JUEGO · parte 1
   Estado, audio, utilidades, inicio, tablero y render de escenarios.
   ============================================================ */
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAX_SCORE = SCENARIOS.length * 100;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SRC_BY_N = Object.fromEntries(SOURCES.map(s => [s.n, s]));
const RESULT_LABEL = {
  optimal: ['✓ Óptima', 'ok'],
  acceptable: ['≈ Válida', 'soft'],
  fix: ['🛠 Corregida', 'fix'],
  law: ['⚖ No conformidad', 'law']
};

const state = {
  screen: 'home',
  idx: 0,
  phase: 'choose',
  order: [],
  selected: null,
  answers: [],
  counts: { correct: 0, valid: 0, fix: 0, law: 0 },
  score: 0,
  majorNC: false,
  pending: null,
  alarmTimer: null,
  modal: null,
  libTab: 'controls',
  lastFocus: null
};

/* ============================================================
   1. AUDIO · Web Audio API, sin archivos externos
   Volumen general: MASTER_VOLUME. Sirena: SIREN_LEVEL.
   Para silenciar: botón global 🔊/🔇 o botón de la alarma.
   ============================================================ */
const AudioEngine = (() => {
  const MASTER_VOLUME = 0.8;
  const SIREN_LEVEL = 0.16;
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let master = null;
  let muted = false;
  let alarm = { on: false, nodes: [], gain: null };

  try { muted = localStorage.getItem('p27001_muted') === '1'; } catch (e) { muted = false; }

  function saveMute() {
    try { localStorage.setItem('p27001_muted', muted ? '1' : '0'); } catch (e) { /* modo privado */ }
  }

  function init() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : MASTER_VOLUME;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    updateUI();
    return true;
  }

  function tone(freq, dur, type = 'sine', level = 0.1, when = 0, glide = null) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, glide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(level, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  function ui() {
    if (!ctx || muted) return;
    tone(720, 0.045, 'square', 0.032);
    tone(980, 0.035, 'triangle', 0.02, 0.028);
  }

  function success() {
    if (!ctx || muted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.52, 'triangle', 0.085, i * 0.085));
    tone(261.63, 0.8, 'sine', 0.045, 0);
  }

  function law() {
    if (!ctx || muted) return;
    tone(110, 0.55, 'sine', 0.16, 0, 60);
    tone(82, 0.7, 'triangle', 0.1, 0.15, 45);
  }

  function impact() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const dur = 0.55;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = Math.pow(1 - i / len, 2.2);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1900, t);
    lp.frequency.exponentialRampToValueAtTime(180, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp);
    lp.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + dur);
    tone(120, 0.65, 'sine', 0.15, 0, 42);
  }

  /* Sirena: sawtooth 760 Hz + LFO 0.65 Hz (±280 Hz) + pulso de amplitud.
     Suena hasta que el usuario interactúa con el panel de consecuencias. */
  function alarmStart() {
    if (!ctx || muted) return;
    alarmStop();
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(SIREN_LEVEL, t + 0.12);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2350;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(760, t);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.65;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 280;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const pulse = ctx.createGain();
    pulse.gain.value = 0.62;
    const pulseLfo = ctx.createOscillator();
    pulseLfo.type = 'sine';
    pulseLfo.frequency.value = 3.1;
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.38;
    pulseLfo.connect(pulseGain);
    pulseGain.connect(pulse.gain);

    osc.connect(pulse);
    pulse.connect(lp);
    lp.connect(g);
    g.connect(master);

    const sub = ctx.createOscillator();
    sub.type = 'square';
    sub.frequency.value = 190;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.035;
    sub.connect(subGain);
    subGain.connect(g);

    osc.start(t); lfo.start(t); pulseLfo.start(t); sub.start(t);
    alarm = { on: true, nodes: [osc, lfo, pulseLfo, sub], gain: g };
  }

  function alarmStop() {
    if (!alarm.on || !ctx) return;
    const t = ctx.currentTime;
    try {
      alarm.gain.gain.cancelScheduledValues(t);
      alarm.gain.gain.setTargetAtTime(0.0001, t, 0.035);
    } catch (e) {}
    alarm.nodes.forEach(n => { try { n.stop(t + 0.3); } catch (e) {} });
    alarm = { on: false, nodes: [], gain: null };
  }

  function toggle() {
    init();
    muted = !muted;
    saveMute();
    if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : MASTER_VOLUME, ctx.currentTime, 0.02);
    if (muted) alarmStop();
    updateUI();
    if (!muted) {
      setTimeout(() => { ui(); tone(880, 0.09, 'sine', 0.04); }, 40);
    }
    return !muted;
  }

  function updateUI() {
    const b = document.getElementById('audioBtn');
    if (!b) return;
    b.textContent = muted ? '🔇' : '🔊';
    b.classList.toggle('muted', muted);
    b.setAttribute('aria-pressed', muted ? 'true' : 'false');
    b.setAttribute('aria-label', muted ? 'Activar audio' : 'Silenciar audio');
    b.title = muted ? 'Activar audio' : 'Silenciar audio';
  }

  function reset() {
    alarmStop();
    if (ctx && master) master.gain.setValueAtTime(muted ? 0 : MASTER_VOLUME, ctx.currentTime);
    updateUI();
  }

  return { init, ui, success, law, impact, alarmStart, alarmStop, toggle, updateUI, reset, isMuted: () => muted, hasContext: () => !!ctx };
})();

function updateAudioUI() { AudioEngine.updateUI(); }

function toggleAudio() {
  const enabled = AudioEngine.toggle();
  toast(enabled ? 'Audio activado' : 'Audio silenciado');
}

function muteAlarm() {
  AudioEngine.alarmStop();
  toast('Alarma silenciada. El expediente sigue abierto.');
}

/* ============================================================
   2. UTILIDADES
   ============================================================ */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let toastTimer = null;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = '<div>' + esc(msg) + '</div>';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function burst(x, y, count = 22) {
  if (REDUCED) return;
  const colors = ['#22d3ee', '#2dd4bf', '#67e8f9', '#a78bfa', '#34d399'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('i');
    el.className = 'confetti';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.background = colors[i % colors.length];
    el.style.setProperty('--dx', (Math.random() * 260 - 130) + 'px');
    el.style.setProperty('--dy', (-Math.random() * 190 - 30) + 'px');
    el.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

function burstCenter(count = 36) {
  burst(window.innerWidth / 2, window.innerHeight * 0.42, count);
}

function floatPoints(x, y, text, color) {
  if (REDUCED) return;
  const el = document.createElement('i');
  el.className = 'float-points';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.color = color;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1050);
}

function riskPct() {
  return Math.min(100, state.counts.law * 30 + state.counts.fix * 9 + state.counts.valid * 4);
}
function riskInfo() {
  const r = riskPct();
  if (r >= 75) return { r, label: 'CRÍTICA', color: '#ff3b5c' };
  if (r >= 45) return { r, label: 'ALTA', color: '#ff7088' };
  if (r >= 20) return { r, label: 'MEDIA', color: '#fbbf24' };
  return { r, label: 'BAJA', color: '#34d399' };
}
function progressPct() {
  return Math.round(state.answers.length / SCENARIOS.length * 100);
}
function sourceChips(nums) {
  return nums.map(n => {
    const s = SRC_BY_N[n];
    return `<button class="src-chip" onclick="openSource(${n})" title="${esc(s ? s.title : 'Fuente ' + n)}">FUENTE <b>[${n}]</b> · ${esc(s ? s.tag : '')}</button>`;
  }).join('');
}
function controlBox(opt, violated) {
  const c = CONTROLS[opt.ctl];
  if (!c) return '';
  return `<div class="mini-card"><div class="mini-label">${violated ? 'Control incumplido' : 'Control aplicado'}</div><b>${c.id} · ${esc(c.name)}</b><p>${esc(c.desc)}</p></div>`;
}
function phva(allOn = false) {
  return `<div class="phva"><span class="${allOn ? 'on' : ''}">P · Planificar</span><span class="${allOn ? 'on' : ''}">H · Hacer</span><span class="${allOn ? 'on' : ''}">V · Verificar</span><span class="${allOn ? 'on' : ''}">A · Actuar</span></div>`;
}

/* ============================================================
   3. PANTALLA DE INICIO
   ============================================================ */
function homeHTML() {
  const ticker = SOURCES.map(s => `<span><b>[${s.n}]</b> ${esc(s.authors.split(';')[0])} · ${esc(s.tag)}</span>`).join('');
  const missions = [
    ['🏛️', 'Gobierno', 'Contexto, alcance, política, roles y liderazgo de la dirección.'],
    ['🎯', 'Riesgo', 'ISO 27005, criterios, tratamiento, aceptación y DOI.'],
    ['👥', 'Personas', 'Formación, incidentes, cese de empleados y debido proceso.'],
    ['🔗', 'Proveedores', 'Nube, DPA, monitoreo, subprocesadores y salida.'],
    ['🛡️', 'Tecnología', 'Accesos, backups, parches, logs y datos clínicos.']
  ];
  return `
  <section class="home">
    <div class="hero">
      <div class="hero-copy">
        <div class="kicker"><span class="dot"></span> Simulación interactiva · ISO/IEC 27001:2022</div>
        <h1 class="hero-title">El caso<br><span class="grad">de Juan</span><span class="thin">Diez decisiones para sostener un SGSI.</span></h1>
        <p class="hero-sub">Juan acaba de ser nombrado CISO de <b>Vitalis Nova</b>, una health-tech que custodia datos de pacientes. Un hospital europeo le exige ISO 27001 en 90 días.</p>
        <p class="lede">Cada escenario te enfrenta a una decisión real: gobierno, riesgo, personas, proveedores, continuidad y mejora. Acierta y avanza. Falla y se activará la alarma de incumplimiento: tendrás que <b>reivindicarte</b> con la Cláusula 10 o <b>enfrentar la ley</b>.</p>
        <div class="hero-actions">
          <button class="btn primary lg" onclick="startGame()"><span class="ico">▶</span> Comenzar la misión</button>
          <button class="btn ghost lg" onclick="openLibrary('controls')"><span class="ico">📚</span> Explorar los 93 controles</button>
        </div>
        <div class="audio-note">🔊 El audio se activa con tu primera interacción. Puedes silenciarlo en cualquier momento.</div>
        <div class="hero-stats">
          <div class="stat"><b>10</b><span>escenarios</span></div>
          <div class="stat"><b>93</b><span>controles</span></div>
          <div class="stat"><b>57</b><span>fuentes</span></div>
          <div class="stat"><b>1000</b><span>puntos</span></div>
        </div>
      </div>
      <aside class="dossier glass" aria-label="Expediente de Juan">
        <div class="dossier-top"><span class="clearance">NIVEL DE ACCESO 04</span><span class="dossier-id">EXP-JP-001</span></div>
        <div class="juan">
          <div class="avatar" aria-hidden="true">JP</div>
          <div>
            <h3>Juan Pérez</h3>
            <p class="role">CISO · Vitalis Nova</p>
            <p>Health-tech · 180 personas · datos clínicos</p>
          </div>
        </div>
        <p class="dossier-quote">«No necesito un sello. Necesito que el hospital pueda confiar en que los datos de sus pacientes están cuidados.»</p>
        <div class="radar-wrap">
          <div class="radar" aria-hidden="true">
            <span class="cross"></span><span class="blip b1"></span><span class="blip b2"></span><span class="blip b3"></span>
          </div>
          <div class="radar-meta"><b>Superficie de riesgo</b>Datos de salud · nube · proveedores · accesos privilegiados · continuidad clínica.</div>
        </div>
        <ul class="objectives">
          <li><i>✓</i> Definir alcance y gobierno antes de prometer fechas.</li>
          <li><i>✓</i> Convertir el riesgo en decisiones trazables.</li>
          <li><i>✓</i> Corregir sin ocultar: Cláusula 10.</li>
          <li><i>✓</i> Llegar a la auditoría con evidencia real.</li>
        </ul>
      </aside>
    </div>

    <section class="section">
      <div class="section-head">
        <div><div class="eyebrow">Mapa de la misión</div><h2>Cinco frentes, una sola disciplina</h2></div>
        <div class="section-note">30+ decisiones · 4 actos</div>
      </div>
      <div class="mission-grid">
        ${missions.map(m => `<article class="mission"><span class="ic">${m[0]}</span><b>${m[1]}</b><p>${m[2]}</p></article>`).join('')}
      </div>
    </section>

    <section class="section">
      <div class="rules-row">
        <div class="rule"><span class="n">01</span><div><b>Decide con criterio</b><p>Cada opción cita un control del Anexo A, una cláusula o un concepto del DOI. No hay respuestas decorativas.</p></div></div>
        <div class="rule"><span class="n">02</span><div><b>Si fallas, suena la alarma</b><p>Sirena, flash rojo y expediente legal. Después eliges: acción correctiva (Cláusula 10) o enfrentar la ley.</p></div></div>
        <div class="rule"><span class="n">03</span><div><b>La evidencia importa</b><p>Los 57 estudios del CSV y los 93 controles están disponibles en el Centro de inteligencia en todo momento.</p></div></div>
      </div>
    </section>

    <div class="ticker" aria-hidden="true"><div class="ticker-track">${ticker}${ticker}</div></div>
  </section>`;
}

/* ============================================================
   4. TABLERO DE JUEGO
   ============================================================ */
function gameHTML() {
  const sc = SCENARIOS[state.idx];
  if (!sc) return homeHTML();
  if (!state.order.length) state.order = shuffle(sc.options.map((_, i) => i));
  const pct = progressPct();
  const risk = riskInfo();
  const answered = state.answers.length;
  return `
  <section class="game">
    <aside class="hud" aria-label="Panel de progreso">
      <div class="hud-card hud-progress glass">
        <div class="hud-top">
          <div class="progress-ring" style="--p:${pct}"><b>${pct}%</b></div>
          <div><div class="eyebrow">Progreso</div><div class="hud-step">Escenario ${state.idx + 1} / ${SCENARIOS.length}</div><div class="hud-sub">${answered} de ${SCENARIOS.length} completados</div></div>
        </div>
        <div class="hud-bar"><i style="width:${pct}%"></i></div>
        <div class="score-row"><span>PUNTUACIÓN</span><b>${state.score}<small> / ${MAX_SCORE}</small></b></div>
      </div>
      <div class="hud-card hud-counters glass">
        <div class="eyebrow">Registro de consecuencias</div>
        <div class="counters">
          <div class="counter"><span class="c-ic ok">✓</span><span>Decisiones correctas</span><b>${state.counts.correct}</b></div>
          <div class="counter"><span class="c-ic fix">🛠</span><span>Reivindicaciones</span><b>${state.counts.fix}</b></div>
          <div class="counter"><span class="c-ic law">⚖</span><span>Enfrentar la ley</span><b>${state.counts.law}</b></div>
          <div class="counter"><span class="c-ic soft">≈</span><span>Válidas parciales</span><b>${state.counts.valid}</b></div>
        </div>
      </div>
      <div class="hud-card hud-risk glass">
        <div class="eyebrow">Exposición legal</div>
        <div class="risk-line"><b style="color:${risk.color}">${risk.label}</b><span>${risk.r} / 100</span></div>
        <div class="risk-bar"><i style="width:${risk.r}%"></i></div>
        <p class="hud-note">${state.counts.law ? 'Cada caso «enfrentar la ley» deja una no conformidad mayor en el expediente.' : 'Sin casos legales. Una corrección a tiempo reduce la exposición.'}</p>
      </div>
      <div class="hud-card hud-log glass">
        <div class="eyebrow">Últimas decisiones</div>
        <div class="log">${logHTML()}</div>
      </div>
    </aside>
    <div class="stage">
      <div class="stage-head">
        <div class="eyebrow">${esc(sc.act)}</div>
        <div class="stage-tools">
          <button class="btn ghost sm" onclick="openLibrary('controls')">📚 Consultar norma</button>
          <button class="btn ghost sm" onclick="openLibrary('sources')">🔎 Evidencia</button>
        </div>
      </div>
      <article class="scenario glass">
        <div class="scenario-meta">
          <span class="chip cyan">Escenario ${String(state.idx + 1).padStart(2, '0')} / ${SCENARIOS.length}</span>
          <span>${esc(sc.place)}</span>
          <span aria-hidden="true">·</span><span>${esc(sc.objective)}</span>
        </div>
        <h2>${esc(sc.title)}</h2>
        <p class="narrative">${esc(sc.brief)}</p>
        <div class="focus-chips">${sc.focus.map(f => `<span class="chip">${esc(f)}</span>`).join('')}${sc.focus.some(f => /doi/i.test(f)) ? '' : '<span class="chip red">DOI obligatorio</span>'}</div>
        <div class="options" role="group" aria-label="Opciones de decisión">
          ${optionsHTML(sc)}
        </div>
        ${state.phase === 'choose' ? '' : feedbackHTML(sc)}
      </article>
      <div class="stage-foot">
        <span>⌨️ Teclas <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span><span class="kbd">4</span> para decidir</span>
        <span>${state.phase === 'choose' ? 'Selecciona una opción para continuar' : 'Revisa el feedback y avanza'}</span>
      </div>
    </div>
  </section>`;
}

function logHTML() {
  if (!state.answers.length) return '<div class="log-empty">Aún no hay decisiones registradas.</div>';
  return state.answers.slice().reverse().slice(0, 4).map(a => {
    const cls = a.result === 'optimal' ? '' : a.result === 'acceptable' ? 'soft' : a.result === 'fix' ? 'fix' : 'law';
    const pts = a.points > 0 ? '+' + a.points : '0';
    const ptsCls = a.points === 0 ? 'zero' : a.result === 'fix' ? 'half' : '';
    return `<div class="log-item"><span class="log-dot ${cls}"></span><div><b>${esc(a.title)}</b><span>${esc(a.ref)}</span></div><em class="${ptsCls}">${pts}</em></div>`;
  }).join('');
}

function optionsHTML(sc) {
  const ans = state.answers.find(a => a.i === state.idx);
  const locked = state.phase !== 'choose';
  return state.order.map((oi, pos) => {
    const o = sc.options[oi];
    let cls = '';
    let icon = '';
    if (ans && ans.optionIndex === oi) {
      cls = ans.result === 'optimal' ? 'picked correct' : ans.result === 'acceptable' ? 'picked soft' : 'picked wrong';
      icon = ans.result === 'optimal' ? '✓' : ans.result === 'acceptable' ? '≈' : '✕';
    } else if (locked) { cls = 'dim'; }
    return `<button class="opt ${cls}" style="--i:${pos}" onclick="choose(${oi}, event)" ${locked ? 'disabled' : ''} aria-label="Opción ${'ABCD'[pos]}: ${esc(o.t)}. Referencia: ${esc(o.ref)}">
      <span class="opt-top"><span class="letter">${'ABCD'[pos]}</span><span class="opt-title">${esc(o.t)}</span>${icon ? `<span class="verdict-icon">${icon}</span>` : ''}</span>
      <span class="opt-desc">${esc(o.d)}</span>
      <span class="ref">${esc(o.ref)}</span>
      ${locked ? '' : '<span class="sel-hint">Elegir →</span>'}
    </button>`;
  }).join('');
}
