/* ============================================================
   VALIDAR · integridad de datos del juego
   Uso:  node codigo-fuente/validar.js
   Comprueba 57 fuentes, 93 controles, 10 escenarios, DOI y cláusulas,
   y que cada opción apunte a un control y a un perfil legal existentes.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const code = ['sources.js', 'controls.js', 'data.js']
  .map(f => fs.readFileSync(path.join(dir, f), 'utf8'))
  .join('\n') + '\nmodule.exports = { SOURCES, CONTROLS, THEMES, LEGAL, SCENARIOS, DOI_ROWS, CLAUSES };';

const mod = { exports: {} };
new Function('module', 'exports', code)(mod, mod.exports);
const { SOURCES, CONTROLS, THEMES, LEGAL, SCENARIOS, DOI_ROWS, CLAUSES } = mod.exports;

const problems = [];

if (SOURCES.length !== 57) problems.push('Se esperaban 57 fuentes y hay ' + SOURCES.length);
if (Object.keys(CONTROLS).length !== 93) problems.push('Se esperaban 93 controles y hay ' + Object.keys(CONTROLS).length);
if (Object.keys(THEMES).length !== 4) problems.push('Se esperaban 4 temas del Anexo A');
if (SCENARIOS.length !== 10) problems.push('Se esperaban 10 escenarios y hay ' + SCENARIOS.length);
if (DOI_ROWS.length !== 10) problems.push('Se esperaban 10 filas de DOI');
if (CLAUSES.length !== 7) problems.push('Se esperaban 7 cláusulas (4–10)');

SCENARIOS.forEach((sc, i) => {
  if (!sc.sources || !sc.sources.length) problems.push('Escenario ' + (i + 1) + ': sin fuentes');
  (sc.sources || []).forEach(n => {
    if (!SOURCES.some(s => s.n === n)) problems.push('Escenario ' + (i + 1) + ': fuente [' + n + '] inexistente');
  });
  if (sc.options.length < 2 || sc.options.length > 4) {
    problems.push('Escenario ' + (i + 1) + ': ' + sc.options.length + ' opciones (deben ser 2–4)');
  }
  const verdicts = sc.options.map(o => o.verdict);
  if (!verdicts.includes('optimal')) problems.push('Escenario ' + (i + 1) + ': sin opción óptima');
  sc.options.forEach((o, j) => {
    ['t', 'd', 'fb', 'ref'].forEach(k => { if (!o[k]) problems.push('Escenario ' + (i + 1) + ', opción ' + j + ': falta ' + k); });
    if (!o.ctl || !CONTROLS[o.ctl]) problems.push('Escenario ' + (i + 1) + ', opción ' + j + ': control inválido ' + o.ctl);
    if (o.verdict === 'wrong') {
      if (!o.legal || !LEGAL[o.legal]) problems.push('Escenario ' + (i + 1) + ', opción ' + j + ': perfil legal inválido ' + o.legal);
      if (!Array.isArray(o.fix) || o.fix.length !== 4) problems.push('Escenario ' + (i + 1) + ', opción ' + j + ': plan correctivo incompleto');
    }
  });
});

DOI_ROWS.forEach(r => { if (!CONTROLS[r.id]) problems.push('DOI: control inexistente ' + r.id); });
SOURCES.forEach(s => {
  if (!s.title) problems.push('Fuente ' + s.n + ': sin título');
  if (!s.insight) problems.push('Fuente ' + s.n + ': sin síntesis');
});

console.log('Fuentes:', SOURCES.length);
console.log('Controles:', Object.keys(CONTROLS).length);
console.log('Escenarios:', SCENARIOS.length);
console.log('Filas DOI:', DOI_ROWS.length);
console.log('Cláusulas:', CLAUSES.length);
console.log(problems.length ? 'PROBLEMAS:\n- ' + problems.join('\n- ') : 'Validación: OK, sin problemas.');
process.exitCode = problems.length ? 1 : 0;
