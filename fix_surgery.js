const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

// Find the corrupted start
const corruptStart = js.indexOf("/* \\n * Proyek Web Edukasi", js.indexOf('rouletteContainer'));

if (corruptStart !== -1) {
    // Find the end of the corruption: the place where it naturally continues.
    // In the duplicated block, there will be ANOTHER "rouletteContainer.style.display = 'block';"
    
    // Let's just find the second "const rouletteContainer = document.getElementById('rouletteContainer');"
    const secondRoulette = js.indexOf("const rouletteContainer = document.getElementById('rouletteContainer');", corruptStart);
    
    if (secondRoulette !== -1) {
        // Find the next line which should be "const rouletteTrack = document.getElementById('rouletteTrack');"
        // Wait, what we want is to REPLACE the corruption with the proper logic that was lost:
        // const rouletteTrack = document.getElementById('rouletteTrack');
        // rouletteContainer.style.display = 'block';
        // const hasil = await drawRandomStory(kelompokId);
        // ... (my fallback logic) ...
        // // Simpan uang saku ...
        
        const part2Start = js.indexOf("// Simpan uang saku dan gender spesifik ke localStorage", secondRoulette);
        
        let properLogic = `
            const rouletteTrack = document.getElementById('rouletteTrack');
            rouletteContainer.style.display = 'block';

            // Tarik undian cerita dari Firebase
            const hasil = await drawRandomStory(kelompokId);
            
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

            `;
            
        let finalJS = js.substring(0, corruptStart) + properLogic + js.substring(part2Start);
        
        // Remove the extra }); that I might have appended at the very end
        while (finalJS.trim().endsWith('});')) {
            finalJS = finalJS.trim().substring(0, finalJS.trim().length - 3);
        }
        while (finalJS.trim().endsWith('}')) {
             finalJS = finalJS.trim().substring(0, finalJS.trim().length - 1);
        }
        
        // The file should end with:
        //         }).onfinish = () => particle.remove();
        //     }
        // }
        // });
        
        finalJS = finalJS.trim() + `
    }
}
});
`;
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', finalJS);
        console.log("Fixed!");
    } else {
        console.log("second roulette not found");
    }
} else {
    console.log("corrupt start not found");
}
