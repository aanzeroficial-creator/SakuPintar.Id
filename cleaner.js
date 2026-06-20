const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

// Replace all instances of literally "\\n});\\n" with empty string
js = js.replace(/\\n\}\);\\n/g, '');

// Ensure proper termination
while (js.trim().endsWith('});')) {
    js = js.trim().substring(0, js.trim().length - 3);
}
while (js.trim().endsWith('}')) {
     js = js.trim().substring(0, js.trim().length - 1);
}

// Add EXACTLY ONE closing brace
js = js.trim() + '\n});\n';

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Cleaned it for real.");
