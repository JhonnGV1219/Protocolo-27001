/* ============================================================
   CONSTRUIR · une las partes en el HTML final autocontenido
   Uso:  node codigo-fuente/construir.js
   Requiere Node.js 18+ (solo para reconstruir; el juego no lo necesita).
   ============================================================ */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const head = fs.readFileSync(path.join(dir, 'head.html'), 'utf8');
const parts = ['sources.js', 'controls.js', 'data.js', 'logic1.js', 'logic2.js', 'logic3.js']
  .map(f => fs.readFileSync(path.join(dir, f), 'utf8'));

const html = head + '\n' + parts.join('\n\n') + '\n</script>\n</body>\n</html>\n';
const out = path.resolve(path.join(dir, '..', 'El caso de Juan - Protocolo 27001.html'));

fs.writeFileSync(out, html, 'utf8');
console.log('HTML generado:', out);
console.log('Bytes:', Buffer.byteLength(html, 'utf8'));

// Comprobación rápida de sintaxis del bloque <script>
const script = html.split('<script>')[1].split('</script>')[0];
new Function(script);
console.log('Sintaxis JavaScript: OK');
