import { readdirSync, statSync } from 'fs'; // Para recorrer carpetas
import { execSync } from 'child_process'; // Para ejecutar node --check
const walk = d => readdirSync(d).flatMap(f => { const p = d + '/' + f; return statSync(p).isDirectory() ? walk(p) : [p]; }); // Lista archivos recursivamente
const files = [...walk('src'), 'main.js'].filter(f => f.endsWith('.js')); // Solo JavaScript del proyecto
for (const f of files) { execSync('node --check ' + f); console.log('OK sintaxis:', f); } // Falla si hay error
