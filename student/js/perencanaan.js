/* 
 * Proyek Web Edukasi Literasi Finansial PGSD
 * Author: Aan Rifai (NIM: 2501050298, No. Absen: 28)
 * Universitas Negeri Semarang (UNNES)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Variabel "State" Aplikasi
    // Ini menyimpan data sementara selama siswa berada di halaman ini
    let uangJajan = 0;
    const savedUangSaku = localStorage.getItem('uangSakuCerita') || localStorage.getItem('uangSakuMisi');
    if (savedUangSaku) {
        uangJajan = parseInt(savedUangSaku);
    }
    let daftarPengeluaran = [];

    // Mengambil Elemen DOM (Input)
    const inputUangJajan = document.getElementById('inputUangJajan');
    const formPengeluaran = document.getElementById('formPengeluaran');
    const namaPengeluaran = document.getElementById('namaPengeluaran');
    const hargaPengeluaran = document.getElementById('hargaPengeluaran');
    const kategoriPengeluaran = document.getElementById('kategoriPengeluaran');
    const alasanPengeluaran = document.getElementById('alasanPengeluaran'); // DOM Baru

    // Mengambil Elemen DOM (Output/Tampilan Angka & Deskripsi)
    const displayUangJajan = document.getElementById('displayUangJajan');
    const displayTotalPengeluaran = document.getElementById('displayTotalPengeluaran');
    const displaySisaUang = document.getElementById('displaySisaUang');
    const expenseList = document.getElementById('expenseList');
    const pesanMotivasi = document.getElementById('pesanMotivasi');
    const rencanaSisaUang = document.getElementById('rencanaSisaUang'); // DOM Baru

    /* ==========================================
       1. EVENT LISTENER (Merespon interaksi user)
       ========================================== */

    // Kejadian saat siswa mengetik nominal uang jajan
    // 'input' event berjalan secara REAL-TIME setiap ada perubahan ketikan
    inputUangJajan.addEventListener('input', (e) => {
        const val = parseInt(e.target.value); // Konversi teks ke angka
        // Jika yang diketik bukan angka (misal dihapus jadi kosong), kembalikan ke 0
        uangJajan = isNaN(val) ? 0 : val;
        
        updateUI(); // Panggil fungsi untuk menghitung ulang semuanya
    });

    // Kejadian saat siswa menekan tombol "Tambah ke Daftar"
    formPengeluaran.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah browser berpindah halaman/reload

        const nama = namaPengeluaran.value;
        const harga = parseInt(hargaPengeluaran.value);
        const kategori = kategoriPengeluaran.value;
        const alasan = alasanPengeluaran.value;

        // Validasi ganda (meski di HTML sudah ada 'required')
        if (nama && !isNaN(harga) && harga > 0 && kategori && alasan) {
            // Mainkan suara cash register saat menambah barang
            const sfxAdd = new Audio('../klik semua.mp3');
            sfxAdd.play().catch(err => {});

            // Tambahkan objek rencana pengeluaran baru ke dalam array
            daftarPengeluaran.push({
                id: Date.now(), // Gunakan waktu saat ini sebagai ID unik (untuk fitur hapus)
                nama: nama,
                harga: harga,
                kategori: kategori,
                alasan: alasan
            });

            // Kosongkan form input agar siap dipakai untuk barang berikutnya
            namaPengeluaran.value = '';
            hargaPengeluaran.value = '';
            kategoriPengeluaran.value = '';
            alasanPengeluaran.value = '';
            
            // Perbarui perhitungan dan tampilan di layar
            updateUI();
        }
    });

    /* ==========================================
       2. LOGIKA PERHITUNGAN & TAMPILAN (UPDATE UI)
       ========================================== */
       
    // Fungsi utama untuk menghitung matematika dan memperbarui seluruh tulisan di HTML
    function updateUI() {
        // A. Hitung Total Pengeluaran dengan melooping (iterasi) array
        let totalPengeluaran = 0;
        daftarPengeluaran.forEach(item => {
            totalPengeluaran += item.harga; // Tambahkan harga setiap item
        });

        // B. Hitung Sisa Uang
        let sisaUang = uangJajan - totalPengeluaran;

        // C. Tampilkan angka ke layar menggunakan fungsi formatRupiah (dari utils.js)
        displayUangJajan.textContent = formatRupiah(uangJajan);
        displayTotalPengeluaran.textContent = formatRupiah(totalPengeluaran);
        displaySisaUang.textContent = formatRupiah(sisaUang);
        
        // Update Widget Mengambang
        if (floatingSisaUangVal) {
            floatingSisaUangVal.textContent = formatRupiah(sisaUang);
            if (sisaUang < 0) {
                floatingSisaUangVal.style.color = "var(--danger)";
            } else if (sisaUang === 0) {
                floatingSisaUangVal.style.color = "#D35400";
            } else {
                floatingSisaUangVal.style.color = "var(--success)";
            }
        }

        // D. Berikan umpan balik / motivasi berdasarkan kondisi keuangan
        const kotakSisaUang = displaySisaUang.parentElement;

        if (sisaUang < 0) {
            // KONDISI MINUS: Pengeluaran lebih besar dari Uang Jajan
            displaySisaUang.style.color = "var(--danger)"; // Warna merah
            kotakSisaUang.style.backgroundColor = "#FDEDEC"; // Latar merah muda
            kotakSisaUang.style.borderColor = "#F1948A";
            pesanMotivasi.textContent = "Wah, uangmu kurang! Coba kurangi rencanamu ya.";
            pesanMotivasi.style.color = "var(--danger)";
        } else if (sisaUang === 0 && uangJajan > 0) {
            // KONDISI PAS: Uang jajan habis tak bersisa
            displaySisaUang.style.color = "#D35400"; // Oranye/Kuning peringatan
            kotakSisaUang.style.backgroundColor = "#FEF5E7";
            kotakSisaUang.style.borderColor = "#F8C471";
            pesanMotivasi.textContent = "Uangmu pas. Sayang sekali hari ini belum ada sisa.";
            pesanMotivasi.style.color = "#D35400";
        } else if (sisaUang > 0 && totalPengeluaran > 0) {
            // KONDISI IDEAL: Ada sisa uang
            displaySisaUang.style.color = "var(--success)"; // Warna hijau
            kotakSisaUang.style.backgroundColor = "#E8F8F5";
            kotakSisaUang.style.borderColor = "#A2D9CE";
            pesanMotivasi.textContent = "Hebat, hari ini uangmu masih tersisa 👍";
            pesanMotivasi.style.color = "var(--success)";
        } else if (uangJajan > 0 && totalPengeluaran === 0) {
             // Baru memasukkan uang, belum ada pengeluaran
             displaySisaUang.style.color = "var(--primary-color)";
             kotakSisaUang.style.backgroundColor = "#E8F8F5";
             kotakSisaUang.style.borderColor = "#A2D9CE";
             pesanMotivasi.textContent = "Wah banyak sisa uangnya! Yuk buat rencana pengeluaranmu.";
             pesanMotivasi.style.color = "var(--text-dark)";
        } else {
            // Kondisi awal / Reset
            displaySisaUang.style.color = "var(--primary-color)";
            kotakSisaUang.style.backgroundColor = "#f1f2f6";
            kotakSisaUang.style.borderColor = "#dfe4ea";
            pesanMotivasi.textContent = "Ayo mulai catat rencanamu!";
            pesanMotivasi.style.color = "var(--text-dark)";
        }

        // E. Memanggil fungsi untuk menggambar ulang daftar di HTML
        renderExpenseList();
    }

    /* ==========================================
       3. FUNGSI RENDER (MENGGAMBAR) DAFTAR
       ========================================== */

    // Fungsi untuk menggambar struktur HTML <li> untuk setiap belanjaan
    function renderExpenseList() {
        expenseList.innerHTML = ''; // Kosongkan daftar lama yang ada di layar

        // Jika tidak ada data
        if (daftarPengeluaran.length === 0) {
            expenseList.innerHTML = '<li style="text-align: center; color: #7f8c8d; padding: 10px;">Belum ada rencana jajan.</li>';
            return; // Berhenti eksekusi fungsi
        }

        // Melakukan perulangan untuk setiap item di array daftarPengeluaran
        daftarPengeluaran.forEach(item => {
            const li = document.createElement('li'); // Buat tag <li> baru
            li.className = 'expense-item';
            
            const badgeClass = item.kategori === 'kebutuhan' ? 'background: #2ECC71;' : 'background: #F39C12;';
            const kategoriText = item.kategori === 'kebutuhan' ? 'Kebutuhan' : 'Keinginan';
            
            // Masukkan struktur di dalamnya beserta tombol hapus
            li.innerHTML = `
                <div style="flex-grow: 1;">
                    <strong>${item.nama}</strong><br>
                    <span style="${badgeClass} color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.75rem; margin-right: 10px;">${kategoriText}</span>
                    <span style="color: var(--danger); font-size: 0.95rem; font-weight: bold;">${formatRupiah(item.harga)}</span>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #555;"><i>Alasan: ${item.alasan}</i></p>
                </div>
                <!-- Simpan ID unik item di dalam atribut data-id agar mudah ditemukan saat mau dihapus -->
                <button class="btn-delete" data-id="${item.id}">Hapus</button>
            `;

            // Tempelkan tag <li> yang sudah jadi ke dalam <ul> (expenseList)
            expenseList.appendChild(li);
        });

        // ==============================
        // FITUR HAPUS ITEM DARI DAFTAR
        // ==============================
        
        // Setelah tombol hapus dirender di layar, kita pasang event listener ke masing-masing tombol
        const deleteButtons = document.querySelectorAll('.btn-delete');
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 1. Ambil ID item yang mau dihapus dari atribut HTML data-id
                const idToDelete = parseInt(e.target.getAttribute('data-id'));
                
                // 2. Filter array: Simpan semua item yang ID-nya BUKAN idToDelete
                // Ini pada dasarnya "menghapus" item tersebut dari array
                daftarPengeluaran = daftarPengeluaran.filter(item => item.id !== idToDelete);
                
                // 3. Panggil lagi fungsi updateUI untuk menghitung ulang total dan sisa uang
                updateUI();
            });
        });
    }

    // ==========================================
    // 4. KIRIM LAPORAN KE GURU
    // ==========================================
    const btnKirimLaporan = document.getElementById('btnKirimLaporan');
    if (btnKirimLaporan) {
        btnKirimLaporan.addEventListener('click', async () => {
            if (uangJajan <= 0) {
                alert("Isi dulu uang saku kamu!");
                return;
            }
            if (rencanaSisaUang && rencanaSisaUang.value.trim() === '') {
                alert("Silakan tulis dulu rencana untuk sisa uangmu!");
                return;
            }

            const authData = sessionStorage.getItem('siswaAuth');
            let siswa = {nama: "Siswa Dummy", kelas: "Debug"};
            if (authData) {
                siswa = JSON.parse(authData);
            }
            
            let totalPengeluaran = 0;
                daftarPengeluaran.forEach(item => totalPengeluaran += item.harga);
                
                const sisa = uangJajan - totalPengeluaran;
                const status = (sisa >= 0) ? "Aman/Ada Sisa" : "Minus (Kekurangan Uang)";
                
                let rincianBarang = "<ul style='margin:5px 0; padding-left:20px; font-size:0.9rem;'>";
                daftarPengeluaran.forEach(item => {
                    const labelKat = item.kategori === 'kebutuhan' ? 'Kebutuhan' : 'Keinginan';
                    rincianBarang += `<li>${item.nama} <i>(${labelKat})</i> : <b>${formatRupiah(item.harga)}</b><br><small>Alasan: ${item.alasan}</small></li>`;
                });
                rincianBarang += "</ul>";
                
                const catatanTambahan = `<br><strong>Rencana Sisa Uang:</strong> ${rencanaSisaUang ? rencanaSisaUang.value : '-'}`;
                
                const oldText = btnKirimLaporan.textContent;
                btnKirimLaporan.textContent = "Mengirim...";
                btnKirimLaporan.disabled = true;

                try {
                    if (typeof saveStudentResult === "function") {
                        await saveStudentResult({
                            nama: siswa.nama,
                            kelas: siswa.kelas,
                            aktivitas: "Perencanaan Keuangan",
                            skorAkhir: formatRupiah(totalPengeluaran), 
                            catatan: `<strong>Uang Saku:</strong> ${formatRupiah(uangJajan)} <br> <strong>Status:</strong> ${status} <br> <strong>Rincian Jajan:</strong>${rincianBarang} ${catatanTambahan}`,
                            // Tambahan Data Lengkap untuk Riwayat Siswa:
                            uangJajan: uangJajan,
                            totalPengeluaran: totalPengeluaran,
                            sisaUang: sisa,
                            status: status,
                            daftarPengeluaran: daftarPengeluaran,
                            rencanaSisaUang: rencanaSisaUang ? rencanaSisaUang.value : '-'
                        });
                    } else {
                        console.warn("Fungsi saveStudentResult tidak ditemukan.");
                    }

                    const sfxSave = new Audio('../benar.mp3');
                    sfxSave.play().catch(e=>{});

                    alert("Laporan berhasil dikirim ke Dasbor Guru dan tersimpan di Cloud!");
                    
                    // Buka tab baru untuk Laporan Rekapan Riwayat Belanja
                    window.open('riwayat-perencanaan.html', '_blank');
                    
                } catch(e) {
                    console.error("Gagal kirim", e);
                    alert("Gagal mengirim laporan. Coba lagi.");
                } finally {
                    btnKirimLaporan.textContent = oldText;
                    btnKirimLaporan.disabled = false;
                }
        });
    }

    // Inisialisasi awal UI jika uang saku dari cerita sudah ada
    if (inputUangJajan && uangJajan > 0) {
        inputUangJajan.value = uangJajan;
    }
    updateUI();
});


    // ==========================================
    // LOGIKA WIDGET MENGAMBANG (DRAGGABLE)
    // ==========================================
    const floatingWidget = document.getElementById('floatingWidget');
    const floatingSisaUangVal = document.getElementById('floatingSisaUangVal');

    if (floatingWidget) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const dragHandle = floatingWidget.querySelector('.drag-handle');

        // Fungsi Drag untuk Mouse dan Touch
        const dragStart = (e) => {
            isDragging = true;
            const event = e.type.includes('touch') ? e.touches[0] : e;
            startX = event.clientX;
            startY = event.clientY;
            
            const rect = floatingWidget.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            // Set position ke absolut fixed relative to viewport
            floatingWidget.style.bottom = 'auto';
            floatingWidget.style.right = 'auto';
            floatingWidget.style.left = initialX + 'px';
            floatingWidget.style.top = initialY + 'px';
            floatingWidget.style.transform = 'scale(1.05)';
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Mencegah scrolling saat ditarik
            const event = e.type.includes('touch') ? e.touches[0] : e;
            
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // Batasi agar tidak keluar layar
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + floatingWidget.offsetWidth > window.innerWidth) newX = window.innerWidth - floatingWidget.offsetWidth;
            if (newY + floatingWidget.offsetHeight > window.innerHeight) newY = window.innerHeight - floatingWidget.offsetHeight;

            floatingWidget.style.left = newX + 'px';
            floatingWidget.style.top = newY + 'px';
        };

        const dragEnd = () => {
            isDragging = false;
            floatingWidget.style.transform = 'scale(1)';
        };

        dragHandle.addEventListener('mousedown', dragStart);
        dragHandle.addEventListener('touchstart', dragStart, {passive: false});

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, {passive: false});

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
