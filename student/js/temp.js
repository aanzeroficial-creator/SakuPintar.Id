/* 
 * Proyek Web Edukasi Literasi Finansial PGSD
 * Author: Aan Rifai (NIM: 2501050298, No. Absen: 28)
 * Universitas Negeri Semarang (UNNES)
 */

document.addEventListener('DOMContentLoaded', async () => {
    const formEksplorasi = document.getElementById('formEksplorasi');
    const limitInfo = document.getElementById('limitInfo');
    const btnSubmit = formEksplorasi ? formEksplorasi.querySelector('button') : null;
    
    // Tampilkan loading di tombol sementara memuat setting
    if (btnSubmit) btnSubmit.textContent = "Memuat...";

    // ==========================================
    // 0. LOGIKA ROTASI LAYAR KHUSUS MOBILE
    // ==========================================
    const btnForceLandscape = document.getElementById('btnForceLandscape');
    const rotateOverlay = document.getElementById('landscape-warning');
    
    async function forceLandscapeMode() {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            }
            
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (e) {
            console.log("Auto-rotate gagal/ditolak oleh browser:", e);
            
            // Ubah teks overlay untuk memberi tahu siswa agar mematikan kunci rotasi
            if (window.innerHeight > window.innerWidth) {
                const overlayText = rotateOverlay.querySelector('h2');
                const overlayDesc = rotateOverlay.querySelector('p');
                
                if (overlayText && overlayDesc) {
                    overlayText.innerHTML = "Gagal Memutar Layar 🔒";
                    overlayDesc.innerHTML = "Sistem HP Anda memblokir rotasi otomatis. <b>Tolong matikan fitur 'Kunci Orientasi' (Rotation Lock) di pengaturan HP Anda</b>, lalu putar HP secara manual ke mode miring!";
                }
                
                if (btnForceLandscape) {
                    btnForceLandscape.style.display = 'none'; // Sembunyikan tombol jika sudah gagal
                }
            }
        }
    }

    if(btnForceLandscape) {
        btnForceLandscape.addEventListener('click', forceLandscapeMode);
    }
    
    // ==========================================
    // 0.1 LOGIKA TAB (CERITA VS FOTO)
    // ==========================================
    const tabCerita = document.getElementById('tabCerita');
    const tabFoto = document.getElementById('tabFoto');
    const btnLanjutFoto = document.getElementById('btnLanjutFoto');
    const secCerita = document.getElementById('sectionCerita');
    const secFoto = document.getElementById('sectionFoto');
    const secGaleri = document.getElementById('sectionGaleri');

    function switchToFoto() {
        tabCerita.classList.remove('active');
        tabFoto.classList.add('active');
        secCerita.style.display = 'none';
        secFoto.style.display = 'block';
        if (secGaleri) secGaleri.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function switchToCerita() {
        tabFoto.classList.remove('active');
        tabCerita.classList.add('active');
        secFoto.style.display = 'none';
        if (secGaleri) secGaleri.style.display = 'none';
        secCerita.style.display = 'block';
        window.scrollTo(0, 0);
    }

    if (tabCerita && tabFoto) {
        tabCerita.addEventListener('click', switchToCerita);
        tabFoto.addEventListener('click', switchToFoto);
        if (btnLanjutFoto) btnLanjutFoto.addEventListener('click', switchToFoto);
    }

    // ==========================================
    // 0.5 MENGAMBIL CERITA & PENGATURAN SECARA REAL-TIME
    // ==========================================
    let currentStorySettings = null;

    if (typeof listenToStorySettings === 'function') {
        listenToStorySettings((storyData) => {
            currentStorySettings = storyData;
            const teksAturan = document.getElementById('teksAturan');
            const pilihanKelompok = document.getElementById('pilihanKelompok');
            
            if(teksAturan) teksAturan.textContent = storyData.aturan;
            
            // Buat pilihan dropdown sesuai jumlah kelompok
            if (pilihanKelompok && pilihanKelompok.options.length <= 1) {
                const jumlah = storyData.jumlahKelompok || 1;
                for (let i = 1; i <= jumlah; i++) {
                    const opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = "Kelompok " + i;
                    pilihanKelompok.appendChild(opt);
                }
            }
        });
    }

    // ==========================================
    // ==========================================
    // 0.6 LOGIKA UNDIAN GACHA CERITA
    // ==========================================
    const btnAcakCerita = document.getElementById('btnAcakCerita');
    const pilihKelompokArea = document.getElementById('pilihKelompokArea');
    const hasilCeritaArea = document.getElementById('hasilCeritaArea');

    if (btnAcakCerita) {
        btnAcakCerita.addEventListener('click', async () => {
            const pilihanKelompok = document.getElementById('pilihanKelompok');
            if (!pilihanKelompok.value) {
                alert("Pilih nomor kelompokmu dulu ya!");
                return;
            }

            // Upaya otomatis masuk ke mode layar penuh (Fullscreen) dan memutar layar ke Lanskap (Landscape)
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                    await document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                    await document.documentElement.msRequestFullscreen();
                }
                
                // Kunci rotasi ke lanskap setelah masuk fullscreen
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock('landscape');
                }
            } catch (err) {
                console.log("Auto-rotate/Fullscreen gagal atau tidak didukung browser:", err);
            }

            const kelompokId = parseInt(pilihanKelompok.value);
            btnAcakCerita.textContent = "Mengacak Misi... 🎲";
            btnAcakCerita.disabled = true;
            pilihanKelompok.disabled = true;

            // Tampilkan Kontainer Roulette & set up DOM
            const rouletteContainer = document.getElementById('rouletteContainer');

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

            // Simpan uang saku dan gender spesifik ke localStorage agar dipakai oleh kuis-belanja.js
            localStorage.setItem('uangSakuCerita', uangSakuMisi.toString());
            localStorage.setItem('genderCerita', genderMisi);
            
            // Simpan data cerita tambahan untuk layar Visual Novel di instruksi-toko.html
            localStorage.setItem('teksMisiCerita', teksMisi);
            localStorage.setItem('fotosMisiCerita', JSON.stringify(fotosMisi));
            localStorage.setItem('aturanMisiCerita', currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
            localStorage.setItem('kelompokMisiCerita', document.getElementById('pilihanKelompok').value);
            localStorage.setItem('genderCerita', genderMisi);
            
            // Simpan data cerita tambahan untuk layar Visual Novel di instruksi-toko.html
            localStorage.setItem('teksMisiCerita', teksMisi);
            localStorage.setItem('fotosMisiCerita', JSON.stringify(fotosMisi));
            localStorage.setItem('aturanMisiCerita', currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
            localStorage.setItem('kelompokMisiCerita', document.getElementById('pilihanKelompok').value);


            // --- ANIMASI ROULETTE ---
            // 1. Ambil semua foto yang tersedia dari cerita lain untuk dijadikan kartu pengecoh
            const storySet = await getStorySettings();
            const allStories = storySet.kumpulanCerita || [];
            let availablePhotos = [];
            allStories.forEach(s => {
                if (s.fotos && s.fotos.length > 0) availablePhotos.push(s.fotos[0]);
            });

            // 2. Isi Track dengan kartu
            rouletteTrack.innerHTML = '';
            const totalCards = 80;
            const winningIndex = 75; // Kartu pemenang ada di urutan ke-75 agar putarannya lama

            for (let i = 0; i < totalCards; i++) {
                let photoSrc = "";
                let isWinner = (i === winningIndex);
                
                if (isWinner) {
                    photoSrc = fotosMisi.length > 0 ? fotosMisi[0] : "";
                } else {
                    if (availablePhotos.length > 0) {
                        photoSrc = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
                    }
                }
                
                let cardHtml = `<div class="roulette-card">`;
                if (photoSrc) {
                    cardHtml += `<img src="${photoSrc}">`;
                } else {
                    const icons = ['🎁', '📦', '🛒', '🛍️', '💎', '💰'];
                    const randomIcon = isWinner ? '🎯' : icons[Math.floor(Math.random() * icons.length)];
                    cardHtml += `<div class="roulette-card-fallback">${randomIcon}</div>`;
                }
                cardHtml += `</div>`;
                rouletteTrack.innerHTML += cardHtml;
            }

            // 3. Reset posisi pita ke awal tanpa animasi
            rouletteTrack.style.transition = 'none';
            rouletteTrack.style.transform = 'translateX(0)';
            void rouletteTrack.offsetWidth; // Force reflow agar animasi jalan dari 0

            // 4. Kalkulasi pergeseran
            const containerWidth = rouletteContainer.offsetWidth;
            const cardWidth = 100; // 90px width + 5px margin left + 5px margin right
            const randomOffset = Math.floor(Math.random() * 40) - 20;
            const targetTranslateX = -((winningIndex * cardWidth) + (cardWidth / 2) - (containerWidth / 2) + randomOffset);

            // Putar efek suara Stumble Guys
            const sfxSpin = new Audio('../spin-stumble.mp3'); 
            // Putar audio dari awal
            sfxSpin.currentTime = 0;
            sfxSpin.play().catch(e=>{});

            // 5. Jalankan animasi!
            rouletteTrack.style.transition = 'transform 11.5s cubic-bezier(0.1, 0.9, 0.15, 1)';
            rouletteTrack.style.transform = `translateX(${targetTranslateX}px)`;

            // --- SETELAH ANIMASI SELESAI ---
            setTimeout(() => {
                const fotoCeritaArea = document.getElementById('fotoCeritaArea');
                if (fotoCeritaArea) {
                    fotoCeritaArea.innerHTML = '';
                    if (fotosMisi.length > 0) {
                        fotosMisi.forEach(base64 => {
                            fotoCeritaArea.innerHTML += `<img src="${base64}" style="width:100%; height:auto; border-radius:10px; border:2px solid #00FFFF; box-shadow:0 0 15px rgba(0,255,255,0.5);">`;
                        });
                        fotoCeritaArea.style.display = 'grid';
                    } else {
                        fotoCeritaArea.style.display = 'none';
                    }
                }

                const teksCerita = document.getElementById('teksCerita');
                if(teksCerita) teksCerita.textContent = teksMisi;
                
                const infoUangSakuMisi = document.getElementById('infoUangSakuMisi');
                if(infoUangSakuMisi && typeof formatRupiah === 'function') {
                    infoUangSakuMisi.textContent = formatRupiah(uangSakuMisi);
                } else if (infoUangSakuMisi) {
                    infoUangSakuMisi.textContent = "Rp " + uangSakuMisi.toLocaleString('id-ID');
                }

                // Sembunyikan area pilih kelompok, tapi JANGAN tampilkan hasilCeritaArea lama
                // pilihKelompokArea.style.display = 'none'; // Tetap sembunyikan
                // hasilCeritaArea.style.display = 'block';
                
                // Sembunyikan seluruh sectionCerita (kotak putih)
                document.getElementById('sectionCerita').style.display = 'none';
                
                // Mulai Visual Novel
                startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
                
                if (hasil && hasil.baruSajaDiundi) {
                    // Tetap play SFX agar lebih meriah
                    const sfxWin = new Audio('../benar.mp3');
                    sfxWin.play().catch(e=>{});
                }
                
                // Selalu jalankan partikel setiap putaran selesai agar meriah!
                if (typeof createParticles === 'function') {
                    createParticles();
                }
            }, 12000); // 11.5s animasi + 0.5s jeda dramatis
        
        });
    }
});

function createParticles() {
    // Tambah jumlah partikel agar lebih ramai dan menyeluruh
    const particleCount = 150; 
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '&#9733;';
        particle.style.position = 'fixed';
        particle.style.zIndex = '999999';
        // Ukuran bintang bervariasi
        particle.style.fontSize = (Math.random() * 30 + 10) + 'px';
        const colors = ['#FFFFFF', '#FFD700', '#FFFF00', '#00FFFF', '#FF69B4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.color = color;
        particle.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px #fff`;
        // Mulai tepat dari tengah layar
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        // Jarak jangkauan tembakan bintang sangat jauh agar memenuhi seluruh layar
        const maxVelocity = Math.max(window.innerWidth, window.innerHeight) * 0.8;
        const velocity = 100 + Math.random() * maxVelocity;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 2500,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)' // Meledak cepat lalu melambat perlahan
        }).onfinish = () => particle.remove();
    }
}
});
