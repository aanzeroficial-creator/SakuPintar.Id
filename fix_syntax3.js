const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');
js = js.replace(/\\n\}\);\\n/g, ''); // Remove the literal if it's there
js = js.trim();
if (!js.endsWith('});')) {
    js += '\n});\n';
}
fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Appended }); cleanly.");
