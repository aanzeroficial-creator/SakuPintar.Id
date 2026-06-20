const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

// Fix the setTimeout block
const oldBlock = `
                // Sembunyikan area pilih kelompok, tapi JANGAN tampilkan hasilCeritaArea lama
                // pilihKelompokArea.style.display = 'none'; // Tetap sembunyikan
                // hasilCeritaArea.style.display = 'block';
                
                // Sembunyikan seluruh sectionCerita (kotak putih)
                document.getElementById('sectionCerita').style.display = 'none';
                
                // Mulai Visual Novel
                startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
`;

const newBlock = `
                // Tampilkan hasil cerita
                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                document.getElementById('sectionCerita').style.display = 'block';
`;

js = js.replace(oldBlock, newBlock);

// Also there might be another variation:
const oldBlock2 = `
                // Sembunyikan area pilih kelompok, tapi JANGAN tampilkan hasilCeritaArea lama
                // pilihKelompokArea.style.display = 'none'; // Tetap sembunyikan
                // hasilCeritaArea.style.display = 'block';
                
                // Sembunyikan seluruh sectionCerita (kotak putih)
                document.getElementById('sectionCerita').style.display = 'none';
                
                // Mulai Visual Novel
                if(typeof startVisualNovel === 'function') {
                     startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
                }
`;

js = js.replace(oldBlock2, newBlock);

// Fallback regex replacement if exact string match fails
js = js.replace(/\\/\\/\\s*Sembunyikan area pilih kelompok[\\s\\S]*?\\/\\/\\s*Mulai Visual Novel[\\s\\S]*?\\);/g, newBlock);


// Remove ANY literal extra closing braces at the end of the file
// The file should end with the createParticles function:
// function createParticles() { ... }
const marker = "}).onfinish = () => particle.remove();\\n    }\\n}";
const markerIndex = js.lastIndexOf(marker);
if (markerIndex !== -1) {
    js = js.substring(0, markerIndex + marker.length) + '\\n';
}

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Completely fixed JS");
