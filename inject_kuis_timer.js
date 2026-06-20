const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/kuis-belanja.js', 'utf8');

// Kita akan cari tempat di mana variabel di-declare, misal let sisaWaktu = 120;
// dan ganti menjadi:
// let sisaWaktu = 120;
// ...
// await getSettings().then(res => { if(res.waktuKuis) sisaWaktu = res.waktuKuis; });

const regex = /(let sisaWaktu = 120;\s*.*?isGameEnded = false;)/s;
const newCode = `$1\n    if (typeof getSettings === 'function') {\n        try {\n            const settings = await getSettings();\n            if (settings && settings.waktuKuis) {\n                sisaWaktu = settings.waktuKuis;\n            }\n        } catch(e) { console.error("Gagal load waktu kuis:", e); }\n    }`;

if (js.includes('let sisaWaktu = 120;') && !js.includes('await getSettings()')) {
    js = js.replace(regex, newCode);
    fs.writeFileSync('d:/New folder (3)/student/js/kuis-belanja.js', js);
    console.log("Kuis Belanja JS injected");
} else {
    console.log("Kuis Belanja JS already injected or variable not found");
}
