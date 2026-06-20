const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

// I need to find the duplicated top part that replaced line 168.
// Since the replace tool messed up, let me just find the string "/* \n * Proyek Web Edukasi Literasi Finansial PGSD"
// wait, the easiest way is to read from `d:/New folder (3)/revert_eksplorasi.js` logic and run it again on a fresh file? No, I don't have a fresh file.
// Let's find where the duplicate starts:
const startOfDup = js.indexOf('/* \n * Proyek Web Edukasi', 10); // Find second occurrence

if (startOfDup !== -1) {
    // The duplicate starts at startOfDup.
    // Let's find the end of the duplicate. It ends right before `            localStorage.setItem('genderCerita', genderMisi);`
    const endMarker = "            localStorage.setItem('genderCerita', genderMisi);";
    const endOfDup = js.indexOf(endMarker, startOfDup);
    
    if (endOfDup !== -1) {
        const toDelete = js.substring(startOfDup, endOfDup);
        js = js.replace(toDelete, `                genderMisi = hasil.cerita.gender || "L";
                fotosMisi = hasil.cerita.fotos || [];
            } else {
                teksMisi = hasil.cerita || "";
            }

            // Simpan uang saku dan gender spesifik ke localStorage agar dipakai oleh kuis-belanja.js
            localStorage.setItem('uangSakuCerita', uangSakuMisi.toString());
            localStorage.setItem('genderCerita', genderMisi);
            
            // Simpan data cerita tambahan untuk layar Visual Novel di instruksi-toko.html
            localStorage.setItem('teksMisiCerita', teksMisi);
            localStorage.setItem('fotosMisiCerita', JSON.stringify(fotosMisi));
            localStorage.setItem('aturanMisiCerita', currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
            localStorage.setItem('kelompokMisiCerita', document.getElementById('pilihanKelompok').value);
`);
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
        console.log("Fixed eksplorasi.js");
    } else {
        console.log("Could not find end marker of duplicate");
    }
} else {
    console.log("Could not find duplicate start");
}
