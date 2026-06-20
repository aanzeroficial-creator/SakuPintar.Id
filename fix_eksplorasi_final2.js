const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

// Find the first and second occurrences
const firstIndex = js.indexOf("document.addEventListener('DOMContentLoaded'");
const secondIndex = js.indexOf("document.addEventListener('DOMContentLoaded'", firstIndex + 1);

if (secondIndex !== -1) {
    const part1End = js.indexOf("const hasil = await drawRandomStory(kelompokId);") + "const hasil = await drawRandomStory(kelompokId);".length;
    const part2Start = js.lastIndexOf("// Simpan uang saku dan gender spesifik ke localStorage");
    
    if (part1End !== -1 && part2Start !== -1 && part2Start > part1End) {
        let cleanJS = js.substring(0, part1End) + `
            
            let teksMisi = "";
            let uangSakuMisi = 20000;
            let genderMisi = "L";
            let fotosMisi = [];

            if (!hasil || !hasil.cerita) {
                teksMisi = "Guru belum memberikan Misi Misteri. Tanyakan pada gurumu ya!";
            } else if (typeof hasil.cerita === 'object' && hasil.cerita !== null) {
                teksMisi = hasil.cerita.teks || "Teks cerita kosong.";
                uangSakuMisi = parseInt(hasil.cerita.uangSaku) || 20000;
                genderMisi = hasil.cerita.gender || "L";
                fotosMisi = hasil.cerita.fotos || [];
            } else {
                teksMisi = hasil.cerita || "Teks cerita kosong.";
            }

            ` + js.substring(part2Start);
        
        // Remove trailing syntax errors manually
        while (cleanJS.trim().endsWith('});')) {
            cleanJS = cleanJS.trim().substring(0, cleanJS.trim().length - 3);
        }
        while (cleanJS.trim().endsWith('}')) {
             cleanJS = cleanJS.trim().substring(0, cleanJS.trim().length - 1);
        }
        
        // Now add EXACTLY what's needed for the structure:
        // document.addEventListener -> btnAcakCerita.addEventListener
        // The structure ends with:
        // function createParticles() { ... }
        // We just need to close the document.addEventListener before function createParticles
        
        // Actually, btnAcakCerita block is inside document.addEventListener.
        // Wait! In the original code, createParticles was inside OR outside?
        // Let's just restore from my `revert_eksplorasi.js` logic! 
        
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', cleanJS + '\\n});\\n');
        console.log("Successfully rebuilt!");
    }
}
