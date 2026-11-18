/* ============================================================
   MOTOR DEL JUEGO · parte 3
   Informe final, Centro de inteligencia, modales, fondo y arranque.
   ============================================================ */
function render(scroll) {
  const app = document.getElementById('app');
  if (!app) return;
  if (state.screen === 'home') app.innerHTML = homeHTML();
  else if (state.screen === 'game') app.innerHTML = gameHTML();
  else app.innerHTML = summaryHTML();
  updateChrome();
  if (scroll) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function updateChrome() {
  AudioEngine.updateUI();
  const status = document.getElementById('topStatus');
  if (status) {
    status.textContent = state.screen === 'home'
      ? 'SISTEMA EN ESPERA'
      : state.screen === 'summary'
        ? 'INFORME FINAL'
        : 'ESCENARIO ' + (state.idx + 1) + ' · ' + (state.phase === 'choose' ? 'DECISIÓN' : state.phase === 'feedback' ? 'REVISIÓN' : 'ALERTA');
  }
  const bar = document.getElementById('topProgress');
  if (bar) {
    const p = state.screen === 'home' ? 0 : state.screen === 'summary' ? 100 : progressPct();
    bar.style.width = p + '%';
  }
}

function startGame() {
  const ok = AudioEngine.init();
  endAlarmVisuals();
  closeModal();
  state.screen = 'game';
  state.idx = 0;
  state.phase = 'choose';
  state.selected = null;
  state.answers = [];
  state.counts = { correct: 0, valid: 0, fix: 0, law: 0 };
  state.score = 0;
  state.majorNC = false;
  state.pending = null;
  state.order = shuffle(SCENARIOS[0].options.map((_, i) => i));
  render(true);
  AudioEngine.ui();
  toast(ok ? (AudioEngine.isMuted() ? 'Misión iniciada · audio silenciado' : 'Misión iniciada · audio activado') : 'Misión iniciada · tu navegador no soporta audio');
}

function resetAll() {
  endAlarmVisuals();
  closeModal();
  AudioEngine.reset();
  state.screen = 'home';
  state.idx = 0;
  state.phase = 'choose';
  state.selected = null;
  state.answers = [];
  state.counts = { correct: 0, valid: 0, fix: 0, law: 0 };
  state.score = 0;
  state.majorNC = false;
  state.pending = null;
  state.order = [];
  state.modal = null;
  state.libTab = 'controls';
  state.lastFocus = null;
  render(true);
  toast('Sesión reiniciada');
}

function goHome() {
  if (state.modal === 'consequence') {
    toast('Resuelve el expediente antes de salir.');
    return;
  }
  endAlarmVisuals();
  closeModal();
  state.screen = 'home';
  state.phase = 'choose';
  render(true);
}

function endGame() {
  state.screen = 'summary';
  state.phase = 'done';
  render(true);
  setTimeout(() => {
    animateSummary();
    if (state.score >= 800) burstCenter(46);
  }, 160);
}

function verdictInfo() {
  const pct = Math.round(state.score / MAX_SCORE * 100);
  if (state.counts.law === 0) {
    if (pct >= 90) return { t: 'CISO de referencia', s: 'Juan llega a la auditoría con un alcance defendible, riesgos trazados y evidencia real. La certificación es consecuencia de un sistema que funciona, no de una carpeta maquillada.' };
    if (pct >= 75) return { t: 'SGSI sólido, con brechas menores', s: 'El sistema se sostiene y la certificación es alcanzable. Quedan decisiones mejorables que la próxima auditoría interna deberá convertir en acciones concretas.' };
    if (pct >= 55) return { t: 'Certificación condicionada', s: 'Hay fundamentos, pero también atajos. El auditor encontrará brechas en los controles que Juan decidió no priorizar; la mejora continua aún no está demostrada.' };
    return { t: 'SGSI en reconstrucción', s: 'La certificación no está lista. Faltan decisiones críticas y evidencia; el sistema depende de la suerte y de personas concretas, no de un proceso.' };
  }
  if (pct >= 75) return { t: 'SGSI sólido, con expediente abierto', s: 'La mayor parte del sistema funciona, pero una decisión de no corregir dejó una no conformidad mayor. La certificación puede llegar; la confianza y la posición legal ya no están intactas.' };
  if (pct >= 55) return { t: 'Certificación en riesgo', s: 'El SGSI avanza con deudas y un expediente legal abierto. Cualquier incidente relacionado con los controles ignorados activará las consecuencias previstas por el RGPD y NIS2.' };
  return { t: 'No conformidad mayor', s: 'El SGSI queda en papel. Hay incumplimientos sin corregir, exposición regulatoria y una certificación que no se sostiene. La prioridad ya no es el sello: es recuperar el control.' };
}

function summaryHTML() {
  const pct = Math.round(state.score / MAX_SCORE * 100);
  const v = verdictInfo();
  const risk = riskInfo();
  const legalCount = state.counts.law;
  const rows = SCENARIOS.map((sc, i) => {
    const a = state.answers.find(x => x.i === i);
    const res = a ? RESULT_LABEL[a.result] : ['—', ''];
    return `<tr>
      <td>${String(i + 1).padStart(2, '0')}</td>
      <td>${esc(sc.title)}</td>
      <td>${a ? esc(a.option.t) : 'Sin decisión'}</td>
      <td>${a ? esc(a.ref) : '—'}</td>
      <td class="res ${res[1]}">${res[0]}</td>
      <td>${a ? a.points : 0}</td>
    </tr>`;
  }).join('');

  const lessons = [];
  if (legalCount) lessons.push('Una no conformidad no corregida no desaparece: se convierte en expediente legal. La Cláusula 10 existe para romper ese ciclo.');
  if (state.counts.fix) lessons.push('Reivindicarse no borra el error, pero demuestra control: causa raíz, acción verificable y aprendizaje. Eso también es un SGSI.');
  if (state.counts.correct >= 6) lessons.push('Las decisiones basadas en riesgo, evidencia y responsabilidades claras sostienen la certificación cuando cambian las personas y las amenazas.');
  if (state.counts.valid) lessons.push('«Válida pero mejorable» es una señal de madurez: cumplir el mínimo no equivale a reducir el riesgo de forma proporcional.');
  lessons.push('El DOI debe justificar inclusiones y exclusiones con dueño, estado y evidencia. Un «no aplica» sin razón es una no conformidad esperando auditoría.');
  lessons.push('La seguridad es un problema de gestión y de personas, no solo de herramientas: los 57 estudios del CSV lo repiten con contextos distintos.');

  const cited = Array.from(new Set(state.answers.flatMap(a => SCENARIOS[a.i] ? SCENARIOS[a.i].sources : []))).sort((a, b) => a - b);

  return `<section class="summary">
    <div class="summary-hero glass">
      <div class="score-ring" aria-label="Puntuación ${state.score} de ${MAX_SCORE}"><div><b id="finalScore">0</b><span>de ${MAX_SCORE}</span></div></div>
      <div class="summary-copy">
        <div class="eyebrow">Informe final · ${esc(new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }))}</div>
        <h1>${v.t}</h1>
        <p>${v.s}</p>
        <div class="badges">
          <span class="chip cyan">${pct}% del objetivo</span>
          <span class="chip ${risk.label === 'BAJA' ? 'green' : risk.label === 'MEDIA' ? 'amber' : 'red'}">Exposición legal: ${risk.label} · ${risk.r}/100</span>
          ${state.majorNC ? '<span class="stamp-inline">NO CONFORMIDAD MAYOR</span>' : '<span class="chip green">Sin no conformidades mayores</span>'}
        </div>
      </div>
    </div>
    <div class="summary-metrics">
      <div class="metric"><span>Puntuación</span><b>${state.score}</b></div>
      <div class="metric"><span>Decisiones correctas</span><b class="green">${state.counts.correct}</b></div>
      <div class="metric"><span>Reivindicaciones</span><b class="amber">${state.counts.fix}</b></div>
      <div class="metric"><span>Enfrentar la ley</span><b class="${state.counts.law ? 'red' : ''}">${state.counts.law}</b></div>
    </div>
    <div class="summary-grid">
      <div class="report-card glass">
        <h3>📋 Registro de decisiones</h3>
        <div class="tb" style="overflow:auto">
          <table class="report-table">
            <thead><tr><th>#</th><th>Escenario</th><th>Decisión de Juan</th><th>Referencia</th><th>Resultado</th><th>Pts</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p class="mu" style="font-size:.68rem;margin:10px 0 0">Válidas parciales: ${state.counts.valid} · Fuentes citadas en esta partida: ${cited.length} de 57. Ábrelas en el Centro de inteligencia para leer la ficha completa.</p>
      </div>
      <aside class="lessons glass">
        <h3>🧠 Lo que Juan se lleva</h3>
        ${lessons.slice(0, 5).map(l => `<div class="lesson"><span>▸</span><div>${esc(l)}</div></div>`).join('')}
        ${legalCount ? `<div class="legal-summary"><b>${legalCount} expediente${legalCount > 1 ? 's' : ''} legal${legalCount > 1 ? 'es' : ''} abierto${legalCount > 1 ? 's' : ''}.</b> La marca de no conformidad mayor es permanente en este informe. La certificación ISO no sustituye el cumplimiento del RGPD ni de NIS2.</div>` : ''}
        <div class="summary-actions">
          <button class="btn primary" onclick="startGame()">↺ Jugar de nuevo</button>
          <button class="btn ghost" onclick="downloadReport()">⬇ Descargar informe</button>
          <button class="btn ghost" onclick="openLibrary('sources')">🔎 Ver las 57 fuentes</button>
          <button class="btn ghost" onclick="resetAll()">⌂ Inicio</button>
        </div>
      </aside>
    </div>
  </section>`;
}

function animateSummary() {
  const ring = $('.score-ring');
  if (ring) {
    const target = Math.round(state.score / MAX_SCORE * 100);
    if (REDUCED) ring.style.setProperty('--p', target);
    else {
      const start = performance.now();
      const dur = 1150;
      const step = now => {
        const t = Math.min(1, (now - start) / dur);
        const val = Math.round(target * (1 - Math.pow(1 - t, 3)));
        ring.style.setProperty('--p', val);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }
  animateNumber(document.getElementById('finalScore'), state.score);
}

function animateNumber(el, to) {
  if (!el) return;
  if (REDUCED) { el.textContent = to; return; }
  const start = performance.now();
  const dur = 1100;
  const step = now => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function downloadReport() {
  const v = verdictInfo();
  const risk = riskInfo();
  const lines = [];
  lines.push('PROTOCOLO 27001 · EL CASO DE JUAN');
  lines.push('Informe de decisiones · ' + new Date().toLocaleString('es-ES'));
  lines.push('='.repeat(64));
  lines.push('Puntuación: ' + state.score + ' / ' + MAX_SCORE + ' (' + Math.round(state.score / MAX_SCORE * 100) + '%)');
  lines.push('Veredicto: ' + v.t);
  lines.push('');
  lines.push('Registro de consecuencias');
  lines.push('  Decisiones correctas: ' + state.counts.correct);
  lines.push('  Válidas parciales:    ' + state.counts.valid);
  lines.push('  Reivindicaciones:     ' + state.counts.fix);
  lines.push('  Enfrentar la ley:     ' + state.counts.law);
  lines.push('  Exposición legal:     ' + risk.label + ' (' + risk.r + '/100)');
  lines.push('  No conformidad mayor: ' + (state.majorNC ? 'SÍ' : 'NO'));
  lines.push('');
  lines.push('Decisiones');
  SCENARIOS.forEach((sc, i) => {
    const a = state.answers.find(x => x.i === i);
    lines.push((i + 1) + '. ' + sc.title);
    lines.push('   Decisión: ' + (a ? a.option.t : 'Sin decisión'));
    lines.push('   Referencia: ' + (a ? a.ref : '—'));
    lines.push('   Resultado: ' + (a ? RESULT_LABEL[a.result][0] : '—') + ' · ' + (a ? a.points : 0) + ' pts');
    if (a && a.result === 'fix' && a.fixPlan) {
      lines.push('   Acción correctiva: causa=' + a.fixPlan.root + ' | acción=' + a.fixPlan.action + ' | responsable=' + a.fixPlan.owner + ' | fecha=' + a.fixPlan.date);
    }
  });
  lines.push('');
  lines.push('Fuentes CSV citadas');
  const cited = Array.from(new Set(state.answers.flatMap(a => SCENARIOS[a.i] ? SCENARIOS[a.i].sources : []))).sort((a, b) => a - b);
  cited.forEach(n => {
    const s = SRC_BY_N[n];
    if (s) lines.push('  [' + n + '] ' + s.authors + ' (' + s.year + '). ' + s.title + '. ' + s.journal + '. ' + (s.doi ? 'DOI: ' + s.doi : 'DOI no registrado'));
  });
  lines.push('');
  lines.push('Nota: simulación educativa. No sustituye asesoría legal ni una auditoría formal.');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'informe-juan-27001.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 900);
  toast('Informe descargado');
}

/* ============================================================
   CENTRO DE INTELIGENCIA
   ============================================================ */
function openLibrary(tab, focusSource) {
  if (state.modal === 'consequence') {
    toast('Resuelve el expediente antes de consultar la norma.');
    return;
  }
  if (state.modal !== 'library') state.lastFocus = document.activeElement;
  state.libTab = tab || 'controls';
  state.modal = 'library';
  document.body.classList.add('modal-open');
  renderLibrary();
  if (focusSource) {
    setTimeout(() => {
      const el = document.getElementById('src-' + focusSource);
      if (el) {
        el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        el.classList.add('flash-highlight');
        setTimeout(() => el.classList.remove('flash-highlight'), 1900);
      }
    }, 90);
  }
}

function openSource(n) {
  if (state.modal === 'consequence') return;
  openLibrary('sources', n);
}

function closeModal() {
  const root = document.getElementById('modalRoot');
  if (root) root.innerHTML = '';
  state.modal = null;
  document.body.classList.remove('modal-open');
  if (state.lastFocus && state.lastFocus.isConnected) {
    try { state.lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }
  state.lastFocus = null;
}

function switchLib(tab) {
  AudioEngine.ui();
  state.libTab = tab;
  renderLibrary();
  setTimeout(() => { const s = $('#libSearch'); if (s) s.focus(); }, 40);
}

function renderLibrary() {
  const tabs = [
    ['controls', '🛡️ 93 controles'],
    ['doi', '📋 DOI'],
    ['clauses', '📘 Cláusulas'],
    ['sources', '🔎 57 fuentes']
  ];
  const searchable = state.libTab === 'controls' || state.libTab === 'sources';
  let content = '';
  let countText = '';

  if (state.libTab === 'controls') {
    countText = '93 controles';
    content = `<div class="lib-intro"><b>Anexo A · ISO/IEC 27001:2022.</b> 93 controles en cuatro temas: 37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos. Cada decisión del juego cita uno de ellos. Usa el buscador para localizar un control por número o palabra clave.</div>`;
    ['A.5', 'A.6', 'A.7', 'A.8'].forEach(theme => {
      const t = THEMES[theme];
      const list = Object.values(CONTROLS).filter(c => c.theme === theme);
      content += `<div class="lib-group"><h3>${t.icon} ${t.name} <span>${list.length} controles · ${Math.round(list.length / 93 * 100)}%</span></h3>${list.map(c => `<div class="ctl-row lib-item"><div class="ctl-id">${c.id}</div><div><div class="ctl-name">${esc(c.name)}</div><div class="ctl-desc">${esc(c.desc)}</div></div></div>`).join('')}</div>`;
    });
  } else if (state.libTab === 'doi') {
    countText = '10 filas de ejemplo';
    content = `<div class="lib-intro"><b>Declaración de Aplicabilidad (DOI).</b> La cláusula 6.1.3 d) exige un documento que identifique los controles necesarios, si se aplican y la justificación. No es una lista de deseos: es la trazabilidad entre el riesgo, el control y la evidencia.</div>
      <div class="doi-grid">
        <div class="doi-card"><b>Qué declara</b><p>Control, aplicabilidad, justificación, estado de implementación, dueño y evidencia. También las exclusiones.</p></div>
        <div class="doi-card"><b>Por qué importa</b><p>El auditor muestrea el DOI para conectar riesgo → tratamiento → control → prueba. Sin él, el Anexo A es una lista sin contexto.</p></div>
        <div class="doi-card"><b>Señal de alarma</b><p>«No aplica» sin justificación, copiar el DOI de otra empresa, no actualizarlo tras un cambio o no asignar dueño.</p></div>
      </div>
      <div class="tb" style="overflow:auto">
        <table class="doi-table">
          <thead><tr><th>Control</th><th>¿Aplica?</th><th>Justificación</th><th>Estado</th><th>Responsable</th><th>Evidencia</th></tr></thead>
          <tbody>${DOI_ROWS.map(r => {
            const c = CONTROLS[r.id];
            const cls = r.state === 'Implementado' ? 'yes' : r.state === 'Parcial' ? 'part' : r.state === 'Planificado' ? 'plan' : 'no';
            return `<tr><td>${r.id}</td><td><span class="badge ${r.applies === 'Sí' ? 'yes' : 'no'}">${r.applies}</span></td><td><b>${esc(c ? c.name : r.id)}</b><br>${esc(r.just)}</td><td><span class="badge ${cls}">${r.state}</span></td><td>${esc(r.owner)}</td><td>${esc(r.ev)}</td></tr>`;
          }).join('')}</tbody>
        </table>
      </div>
      <div class="lib-intro" style="margin-top:14px"><b>Regla de oro:</b> excluir un control no es ignorarlo. A.7.4 se marca «No aplica» porque la sala de servidores la opera un proveedor certificado y el control se hereda vía A.5.23; la justificación, el contrato y la evidencia están en el expediente. La decisión de exclusión también debe tener dueño y aprobación.</div>
      <div class="lib-group"><h3>Errores frecuentes en el DOI <span>evitar</span></h3>
        <div class="doi-card"><b>1 · Copiar y pegar</b><p>Un DOI de otra organización no refleja tus activos, riesgos ni exclusiones.</p></div>
        <div class="doi-card"><b>2 · «No aplica» sin razón</b><p>La cláusula 6.1.3 d) exige justificar la inclusión y la exclusión. Un auditor pedirá la evidencia.</p></div>
        <div class="doi-card"><b>3 · Estado sin evidencia</b><p>«Implementado» sin política, registro, configuración o prueba es una afirmación, no un control.</p></div>
      </div>`;
  } else if (state.libTab === 'clauses') {
    countText = 'Cláusulas 4–10';
    content = `<div class="lib-intro"><b>El SGSI más allá del Anexo A.</b> Los 93 controles son el catálogo de referencia; las cláusulas 4–10 son los requisitos del sistema de gestión que hacen que esos controles se planifiquen, operen, evalúen y mejoren. Una auditoría evalúa ambos.</div>
      ${CLAUSES.map(c => `<div class="clause-card"><div class="cn">CLÁUSULA ${c.n}</div><h4>${esc(c.t)}</h4><p>${esc(c.d)}</p><ul>${c.k.map(k => `<li>${esc(k)}</li>`).join('')}</ul></div>`).join('')}
      <div class="lib-group"><h3>ISO/IEC 27001:2022 en una frase <span>contexto</span></h3>
        <div class="doi-card"><b>93 controles · 4 temas · 11 controles nuevos</b><p>La edición 2022 reorganizó el Anexo A y añadió controles como inteligencia de amenazas (A.5.7), servicios en la nube (A.5.23), continuidad TIC (A.5.30), monitoreo físico (A.7.4), monitoreo (A.8.16), filtrado web (A.8.23) y codificación segura (A.8.28).</p></div>
        <div class="doi-card"><b>No conformidad mayor vs. menor</b><p>Una mayor afecta la capacidad del SGSI para lograr los resultados previstos o incumple un requisito de forma sistemática. Una menor es un fallo puntual. Ambas se registran y se corrigen; ocultarlas es una falta de integridad.</p></div>
      </div>`;
  } else {
    countText = '57 registros';
    content = `<div class="lib-intro"><b>Evidencia científica · 57 registros del CSV.</b> Cada ficha conserva título, autores, año, revista, editorial, acceso abierto, DOI y los campos de abstract, método, resultados y conclusiones. La síntesis en español conecta el estudio con una decisión del juego. Los chips [n] del feedback abren esta pestaña en la fuente citada.</div>`;
    SOURCES.forEach(s => {
      content += `<article class="src-card lib-item" id="src-${s.n}">
        <div class="src-top">
          <div class="src-num">${s.n}</div>
          <div style="min-width:0">
            <div class="src-title">${esc(s.title)}<span class="src-tag">${esc(s.tag)}</span></div>
            <div class="src-meta">${esc(s.authors)} · ${esc(s.year)} · ${esc(s.journal)} · ${s.open ? 'Open Access' : 'Acceso restringido'}</div>
            <p class="src-insight">${esc(s.insight)}</p>
            <div class="src-more"><details><summary>Ficha completa · abstract, método, resultados y conclusiones</summary>
              <div><b>Abstract</b>${esc(s.abstract)}</div>
              <div><b>Método</b>${esc(s.methods)}</div>
              <div><b>Resultados</b>${esc(s.results)}</div>
              <div><b>Conclusiones</b>${esc(s.conclusions)}</div>
              <div><b>Publicación</b>${esc(s.publisher)} · ${s.doi ? 'DOI: ' + esc(s.doi) : 'DOI no registrado en el CSV'}</div>
            </details></div>
          </div>
        </div>
      </article>`;
    });
  }

  const tools = searchable
    ? `<div class="lib-tools"><div class="search"><input id="libSearch" type="search" placeholder="Buscar por número, control, autor o palabra clave…" aria-label="Buscar en el Centro de inteligencia" oninput="filterLibrary()"></div><span class="lib-count" id="libCount">${countText}</span></div>`
    : `<div class="lib-tools"><span class="lib-count" id="libCount">${countText}</span></div>`;

  document.getElementById('modalRoot').innerHTML = `<div class="overlay lib-overlay" onclick="if(event.target===this)closeModal()">
    <div class="sheet lib" role="dialog" aria-modal="true" aria-label="Centro de inteligencia ISO 27001">
      <div class="lib-head">
        <div><div class="eyebrow">Centro de inteligencia</div><h2>ISO/IEC 27001:2022</h2></div>
        <button class="icon-btn" onclick="closeModal()" aria-label="Cerrar" title="Cerrar">✕</button>
      </div>
      <div class="lib-tabs" role="tablist">
        ${tabs.map(t => `<button class="lib-tab ${state.libTab === t[0] ? 'active' : ''}" role="tab" aria-selected="${state.libTab === t[0]}" onclick="switchLib('${t[0]}')">${t[1]}</button>`).join('')}
      </div>
      ${tools}
      <div class="lib-body" id="libBody">${content}</div>
    </div>
  </div>`;
  updateLibCount();
  if (searchable) setTimeout(() => { const s = $('#libSearch'); if (s && state.modal === 'library') s.focus(); }, 50);
}

function filterLibrary() {
  const input = document.getElementById('libSearch');
  if (!input) return;
  const q = input.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const items = $$('#libBody .lib-item');
  items.forEach(el => {
    const txt = el.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    el.classList.toggle('hidden', q !== '' && !txt.includes(q));
  });
  $$('#libBody .lib-group').forEach(g => {
    const any = Array.from(g.querySelectorAll('.lib-item')).some(el => !el.classList.contains('hidden'));
    g.classList.toggle('hidden', !any);
  });
  updateLibCount();
}

function updateLibCount() {
  const c = document.getElementById('libCount');
  if (!c) return;
  const items = $$('#libBody .lib-item');
  if (!items.length) return;
  const visible = items.filter(el => !el.classList.contains('hidden')).length;
  c.textContent = visible === items.length ? `${items.length} registros` : `${visible} de ${items.length} resultados`;
}

/* ============================================================
   INTERACCIÓN GLOBAL, FONDO Y ARRANQUE
   ============================================================ */
function onKey(e) {
  if (state.modal === 'library') {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const focusables = $$('#modalRoot button, #modalRoot input, #modalRoot summary, #modalRoot [href]').filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return;
  }
  if (state.modal === 'consequence') return;
  if (state.screen !== 'game' || state.phase !== 'choose') return;
  const tag = (e.target && e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (['1', '2', '3', '4'].includes(e.key)) {
    const pos = Number(e.key) - 1;
    const oi = state.order[pos];
    if (oi != null) choose(oi, null);
  }
}

function rippleHandler(e) {
  const el = e.target.closest('.btn');
  if (!el || el.disabled) return;
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const span = document.createElement('span');
  span.className = 'ripple';
  span.style.width = span.style.height = size + 'px';
  span.style.left = (e.clientX - r.left - size / 2) + 'px';
  span.style.top = (e.clientY - r.top - size / 2) + 'px';
  el.appendChild(span);
  setTimeout(() => span.remove(), 600);
}

/* Fondo de red de partículas */
let canvas, cctx, nodes = [], W = 0, H = 0, resizeTimer = null;
const mouse = { x: -9999, y: -9999 };

function initCanvas() {
  canvas = document.getElementById('net');
  if (!canvas) return;
  cctx = canvas.getContext('2d');
  resizeCanvas();
  createNodes();
  if (!REDUCED) requestAnimationFrame(drawNet);
  else drawFrame();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeCanvas(); createNodes(); if (REDUCED) drawFrame(); }, 160);
  });
  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createNodes() {
  const n = Math.min(64, Math.max(22, Math.floor(W * H / 32000)));
  nodes = Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.4 + 0.55
  }));
}

function drawNet() {
  drawFrame();
  if (!REDUCED) requestAnimationFrame(drawNet);
}

function drawFrame() {
  if (!cctx) return;
  cctx.clearRect(0, 0, W, H);
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < -20) n.x = W + 20;
    if (n.x > W + 20) n.x = -20;
    if (n.y < -20) n.y = H + 20;
    if (n.y > H + 20) n.y = -20;
    const dx = n.x - mouse.x;
    const dy = n.y - mouse.y;
    const d = Math.hypot(dx, dy);
    if (d < 130 && d > 0) {
      n.x += (dx / d) * 0.35;
      n.y += (dy / d) * 0.35;
    }
  });
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 128) {
        cctx.strokeStyle = 'rgba(34,211,238,' + ((1 - d / 128) * 0.14).toFixed(3) + ')';
        cctx.lineWidth = 0.6;
        cctx.beginPath();
        cctx.moveTo(nodes[i].x, nodes[i].y);
        cctx.lineTo(nodes[j].x, nodes[j].y);
        cctx.stroke();
      }
    }
  }
  nodes.forEach(n => {
    cctx.fillStyle = 'rgba(103,232,249,.55)';
    cctx.beginPath();
    cctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    cctx.fill();
  });
}

function boot() {
  AudioEngine.updateUI();
  render(false);
  initCanvas();
  document.addEventListener('keydown', onKey);
  document.addEventListener('click', rippleHandler);
  document.addEventListener('pointerdown', () => {
    if (AudioEngine.hasContext()) AudioEngine.init();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) AudioEngine.alarmStop();
  });
}

boot();
