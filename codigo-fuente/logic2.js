/* ============================================================
   MOTOR DEL JUEGO · parte 2
   Feedback, decisiones, alarma de incumplimiento y expediente.
   ============================================================ */
function feedbackHTML(sc) {
  const ans = state.answers.find(a => a.i === state.idx);
  if (!ans) return '';
  const o = ans.option;
  const cls = ans.result === 'optimal' ? 'correct' : ans.result === 'acceptable' ? 'soft' : ans.result === 'fix' ? 'fix' : 'law';
  const icon = ans.result === 'optimal' ? '✓' : ans.result === 'acceptable' ? '≈' : ans.result === 'fix' ? '🛠' : '⚖';
  const kicker = ans.result === 'optimal' ? 'Decisión alineada' : ans.result === 'acceptable' ? 'Decisión válida · mejorable' : ans.result === 'fix' ? 'No conformidad corregida · Cláusula 10' : 'No conformidad mayor · expediente abierto';
  const title = ans.result === 'optimal' ? 'Juan elige el camino correcto' : ans.result === 'acceptable' ? 'Cumple el mínimo, pero deja una brecha' : ans.result === 'fix' ? 'Juan se reivindica y corrige' : 'Juan decide enfrentar la ley';
  const ptsClass = ans.points === 0 ? 'zero' : ans.result === 'fix' ? 'half' : '';
  const ptsLabel = ans.points > 0 ? '+' + ans.points : '0';

  let secondCard = '';
  if (ans.result === 'optimal') {
    secondCard = `<div class="mini-card"><div class="mini-label">Cómo se sostiene</div><b>PHVA + evidencia verificable</b>${phva(false)}<p>Planificar el riesgo, hacer el control, verificar la evidencia y actuar sobre la brecha.</p></div>`;
  } else if (ans.result === 'acceptable') {
    secondCard = `<div class="mini-card"><div class="mini-label">Qué falta para madurar</div><b>De cumplir a mejorar</b>${phva(false)}<p>La decisión avanza, pero conviene cerrar la brecha antes de la auditoría y dejar evidencia de la verificación.</p></div>`;
  } else if (ans.result === 'fix') {
    const f = ans.fixPlan || {};
    secondCard = `<div class="mini-card"><div class="mini-label">Plan de acción correctiva</div><b>Causa raíz → acción → responsable → fecha</b>
      <p><b>Causa:</b> ${esc(f.root || '—')}</p><p><b>Acción:</b> ${esc(f.action || '—')}</p><p><b>Responsable:</b> ${esc(f.owner || '—')} · <b>Fecha:</b> ${esc(f.date || '—')}</p>
      ${phva(true)}
    </div>`;
  } else {
    secondCard = `<div class="mini-card"><div class="mini-label">Cláusulas 6 y 9</div><b>Planificar y evaluar el desempeño</b><p>La Cláusula 6 obliga a tratar el riesgo y la 9 a medirlo y auditarlo. Ignorar el hallazgo convierte un fallo en una decisión no conforme.</p><span class="stamp-inline">NO CONFORMIDAD MAYOR</span></div>`;
  }

  const legalLine = ans.result === 'law'
    ? `<p style="color:#ffc3ce"><b>Expediente:</b> ${esc(LEGAL[o.legal].label)}. La marca de no conformidad mayor quedará visible en el informe final.</p>`
    : '';

  return `<div class="fb ${cls}" role="status" aria-live="polite">
    <div class="fb-head">
      <div class="fb-icon">${icon}</div>
      <div><div class="eyebrow">${kicker}</div><h3>${title}</h3></div>
      <div class="fb-points ${ptsClass}">${ptsLabel} pts</div>
    </div>
    <p>${esc(o.fb)}</p>
    ${legalLine}
    <div class="fb-grid">
      ${controlBox(o, ans.result === 'law')}
      ${secondCard}
    </div>
    <div class="mini-label" style="margin-top:13px">Evidencia utilizada</div>
    <div class="source-chips">${sourceChips(sc.sources)}</div>
    <div class="fb-actions">
      <button class="btn ghost" onclick="openLibrary('controls')">📚 Ver controles</button>
      <button class="btn primary" onclick="nextScenario()">${state.idx + 1 >= SCENARIOS.length ? 'Ver el veredicto final' : 'Continuar'} →</button>
    </div>
  </div>`;
}

function addAnswer(ans) {
  state.answers.push(ans);
  state.score += ans.points;
  if (ans.result === 'optimal') state.counts.correct++;
  else if (ans.result === 'acceptable') state.counts.valid++;
  else if (ans.result === 'fix') state.counts.fix++;
  else if (ans.result === 'law') { state.counts.law++; state.majorNC = true; }
}

function choose(optIndex, event) {
  if (state.screen !== 'game' || state.phase !== 'choose') return;
  const sc = SCENARIOS[state.idx];
  const opt = sc.options[optIndex];
  if (!opt) return;
  const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
  const y = event && event.clientY ? event.clientY : window.innerHeight / 2;

  if (opt.verdict === 'wrong') {
    state.selected = optIndex;
    state.phase = 'alarm';
    render(false);
    startAlarmSequence(optIndex, opt);
    return;
  }

  const result = opt.verdict === 'optimal' ? 'optimal' : 'acceptable';
  const points = result === 'optimal' ? 100 : 65;
  addAnswer({
    i: state.idx,
    title: sc.title,
    optionIndex: optIndex,
    option: opt,
    result,
    points,
    ref: opt.ref
  });
  state.phase = 'feedback';
  AudioEngine.success();
  render(false);
  burst(x, y, result === 'optimal' ? 26 : 12);
  floatPoints(x, y, '+' + points, result === 'optimal' ? '#34d399' : '#fbbf24');
  toast(result === 'optimal' ? 'Decisión alineada · +100 puntos' : 'Decisión válida, pero mejorable · +65 puntos');
  setTimeout(() => { const b = $('#app .fb-actions .btn.primary'); if (b) b.focus(); }, 120);
}

/* ---------- Alarma ---------- */
let typeTimer = null;
function typeText(el, text) {
  if (!el) return;
  clearInterval(typeTimer);
  if (REDUCED) { el.textContent = text; return; }
  const chars = Array.from(text);
  el.innerHTML = '<span></span><span class="caret"></span>';
  const span = el.firstChild;
  let i = 0;
  typeTimer = setInterval(() => {
    span.textContent += chars[i++];
    if (i >= chars.length) {
      clearInterval(typeTimer);
      typeTimer = null;
      const c = el.querySelector('.caret');
      if (c) setTimeout(() => c.remove(), 650);
    }
  }, 36);
}

function startAlarmSequence(optIndex, opt) {
  document.body.classList.add('alarm');
  typeText($('#alarmText'), '⚠️ ALERTA DE INCUMPLIMIENTO ISO 27001');
  AudioEngine.impact();
  setTimeout(() => { if (state.phase === 'alarm') AudioEngine.alarmStart(); }, 230);
  clearTimeout(state.alarmTimer);
  state.alarmTimer = setTimeout(() => {
    if (state.phase === 'alarm') {
      state.pending = {
        i: state.idx,
        opt,
        mode: 'choice',
        exp: 'EXP-27001-' + String(state.answers.length + 1).padStart(2, '0') + '-' + new Date().getFullYear()
      };
      state.phase = 'consequence';
      state.modal = 'consequence';
      document.body.classList.add('modal-open');
      renderConsequence();
    }
  }, REDUCED ? 450 : 1750);
  updateChrome();
}

function endAlarmVisuals() {
  clearTimeout(state.alarmTimer);
  state.alarmTimer = null;
  AudioEngine.alarmStop();
  document.body.classList.remove('alarm');
  clearInterval(typeTimer);
  typeTimer = null;
  const t = $('#alarmText');
  if (t) t.textContent = '';
}

function resolvePath(path) {
  if (!state.pending) return;
  AudioEngine.ui();
  endAlarmVisuals();
  state.pending.mode = path;
  renderConsequence();
}

/* ---------- Expediente / bifurcación ---------- */
function renderConsequence() {
  const p = state.pending;
  if (!p) return;
  const sc = SCENARIOS[p.i];
  const o = p.opt;
  const legal = LEGAL[o.legal] || LEGAL.governance;
  const ctl = CONTROLS[o.ctl];
  let body = '';

  if (p.mode === 'choice') {
    body = `
      <div class="paths">
        <button class="path fix" onclick="resolvePath('fix')">
          <span class="path-ic">🛠️</span>
          <span class="path-kicker">Opción A · Cláusula 10 · Mejora</span>
          <b class="path-title">Reivindicarse</b>
          <span class="path-desc">Reconoce la no conformidad, documenta la causa raíz y registra una acción correctiva con responsable y fecha. Verifica su eficacia.</span>
          <span class="path-tag">Recuperas 50 pts · La alarma se detiene</span>
        </button>
        <button class="path law" onclick="resolvePath('law')">
          <span class="path-ic">⚖️</span>
          <span class="path-kicker">Opción B · RGPD · NIS2 · Certificación</span>
          <b class="path-title">Enfrentar la ley</b>
          <span class="path-desc">No corriges el incumplimiento. Asumes el impacto regulatorio, contractual y reputacional del expediente.</span>
          <span class="path-tag">0 pts · No conformidad mayor permanente</span>
        </button>
      </div>
      <div class="modal-note">La alarma se detiene en cuanto interactúas con este panel. La decisión queda registrada en el informe final.</div>`;
  } else if (p.mode === 'fix') {
    const f = o.fix || ['', '', 'Juan Pérez · CISO', '2026-12-18'];
    body = `
      <form class="fix-wrap" onsubmit="event.preventDefault();submitFix()">
        <div class="fix-top"><span class="big">🛠️</span><div><b>Plan de acción correctiva · Cláusula 10.2</b><p>Documenta la no conformidad, corrige la causa y verifica la eficacia. No basta con «reparar» el síntoma.</p></div></div>
        <div class="fix-form">
          <div class="field full"><label for="fixRoot">1 · Causa raíz</label><input id="fixRoot" required value="${esc(f[0])}" autocomplete="off"></div>
          <div class="field full"><label for="fixAction">2 · Acción correctiva</label><input id="fixAction" required value="${esc(f[1])}" autocomplete="off"></div>
          <div class="field"><label for="fixOwner">3 · Responsable</label><input id="fixOwner" required value="${esc(f[2])}" autocomplete="off"></div>
          <div class="field"><label for="fixDate">4 · Fecha compromiso</label><input id="fixDate" type="date" required value="${esc(f[3])}"></div>
        </div>
        <div class="fix-note"><b>Cláusula 10.2:</b> reaccionar ante la no conformidad, evaluar la necesidad de acción, implementarla, revisar su eficacia y actualizar los riesgos. El ciclo PHVA convierte el error en aprendizaje.</div>
        <div class="clause10"><span>PLANIFICAR</span><span>HACER</span><span>VERIFICAR</span><span>ACTUAR</span></div>
        <div class="modal-actions">
          <button type="button" class="btn ghost" onclick="backToChoice()">← Reconsiderar</button>
          <button type="submit" class="btn success">Registrar acción correctiva · +50 pts</button>
        </div>
      </form>`;
  } else {
    body = `
      <div class="legal-wrap">
        <div class="legal-file">
          <div class="legal-head">
            <div><div class="eyebrow red">Expediente legal</div><b>${esc(p.exp)} · ${esc(legal.label)}</b></div>
            <div class="legal-stamp">NO CONFORMIDAD<br>MAYOR</div>
          </div>
          <p class="legal-focus"><b>Hecho:</b> ${esc(o.legalFocus || o.why)}</p>
          <div class="legal-baseline">
            <span>RGPD · hasta 20 M€ o 4 %</span>
            <span>Ley local · sanción + indemnización</span>
            <span>NIS2 · hasta 10 M€ o 2 %</span>
            <span>Certificación · suspensión o retirada</span>
            <span>CISO · responsabilidad civil/penal</span>
          </div>
          <div class="legal-items">
            ${legal.items.map((it, i) => `<div class="legal-item" style="--i:${i}"><span class="n">${i + 1}</span><div><b>${esc(it.t)}</b><p>${esc(it.d)}</p></div></div>`).join('')}
          </div>
          <div class="legal-foot">Fundamento ISO/IEC 27001: Cláusulas 6 (planificación del riesgo) y 9 (evaluación del desempeño). No corregir una no conformidad es, en sí mismo, un incumplimiento del SGSI.</div>
        </div>
        <div class="modal-actions">
          <button class="btn ghost" onclick="backToChoice()">← Reconsiderar</button>
          <button class="btn danger" onclick="submitLaw()">⚖️ Firmar expediente y continuar · 0 pts</button>
        </div>
      </div>`;
  }

  const html = `<div class="overlay consequence" role="alertdialog" aria-modal="true" aria-label="Panel de consecuencias de cumplimiento">
    <div class="sheet breach">
      <div class="breach-head">
        <div class="breach-mark" aria-hidden="true">⚠</div>
        <div><div class="eyebrow red">Incidente de cumplimiento · ${esc(p.exp)}</div><h2>Se ha detectado un incumplimiento</h2></div>
        <button class="icon-btn" onclick="muteAlarm()" aria-label="Silenciar alarma" title="Silenciar alarma">🔇</button>
      </div>
      <div class="violation">
        <div class="violation-ref">${esc(o.ref)}</div>
        <b>${ctl ? esc(ctl.id + ' · ' + ctl.name) : 'Requisito del SGSI'}</b>
        <p>${esc(o.why || 'La decisión no cumple el requisito identificado.')}</p>
        ${ctl ? `<p class="ctl-desc">${esc(ctl.desc)}</p>` : ''}
      </div>
      ${body}
    </div>
  </div>`;
  const root = document.getElementById('modalRoot');
  root.innerHTML = html;
  const sheet = root.querySelector('.sheet');
  if (sheet) {
    sheet.addEventListener('pointerdown', () => { AudioEngine.alarmStop(); }, { once: true });
  }
  setTimeout(() => {
    const first = root.querySelector('.path, #fixRoot');
    if (first) first.focus();
  }, 80);
}

function backToChoice() {
  if (!state.pending) return;
  AudioEngine.ui();
  state.pending.mode = 'choice';
  renderConsequence();
}

function submitFix() {
  const root = document.getElementById('fixRoot');
  const action = document.getElementById('fixAction');
  const owner = document.getElementById('fixOwner');
  const date = document.getElementById('fixDate');
  if (!root || !action || !owner || !date) return;
  if (!root.value.trim() || !action.value.trim() || !owner.value.trim() || !date.value) {
    toast('Completa causa, acción, responsable y fecha.');
    return;
  }
  if (!state.pending) return;
  const p = state.pending;
  const sc = SCENARIOS[p.i];
  addAnswer({
    i: p.i,
    title: sc.title,
    optionIndex: p.opt ? SCENARIOS[p.i].options.indexOf(p.opt) : null,
    option: p.opt,
    result: 'fix',
    points: 50,
    ref: p.opt.ref,
    fixPlan: { root: root.value.trim(), action: action.value.trim(), owner: owner.value.trim(), date: date.value }
  });
  state.pending = null;
  closeModal();
  state.phase = 'feedback';
  render(false);
  AudioEngine.success();
  burstCenter(18);
  toast('Acción correctiva registrada · +50 puntos');
  setTimeout(() => { const b = $('#app .fb-actions .btn.primary'); if (b) b.focus(); }, 140);
}

function submitLaw() {
  if (!state.pending) return;
  const p = state.pending;
  const sc = SCENARIOS[p.i];
  addAnswer({
    i: p.i,
    title: sc.title,
    optionIndex: SCENARIOS[p.i].options.indexOf(p.opt),
    option: p.opt,
    result: 'law',
    points: 0,
    ref: p.opt.ref
  });
  state.pending = null;
  closeModal();
  state.phase = 'feedback';
  render(false);
  AudioEngine.law();
  toast('Expediente firmado · No conformidad mayor registrada');
  setTimeout(() => { const b = $('#app .fb-actions .btn.primary'); if (b) b.focus(); }, 140);
}

function nextScenario() {
  if (state.phase !== 'feedback') return;
  AudioEngine.ui();
  if (state.idx + 1 >= SCENARIOS.length) {
    endGame();
    return;
  }
  state.idx++;
  state.phase = 'choose';
  state.selected = null;
  state.order = shuffle(SCENARIOS[state.idx].options.map((_, i) => i));
  render(true);
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
