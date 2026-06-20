/* 
 * Proyek Web Edukasi Literasi Finansial PGSD
 * Author: Aan Rifai (NIM: 2501050298, No. Absen: 28)
 * Universitas Negeri Semarang (UNNES)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Log pesan ke console browser sebagai tanda file JS dimuat dengan baik
    console.log("Aplikasi Siswa Pintar Finansial Siap!");

    // CATAT AKTIVITAS: Masuk ke Menu Utama
    if (typeof logActivity === 'function') {
        logActivity('📱 Masuk ke Menu Utama (Dashboard)');
    }

    // ===================================================
    // LOGIKA FILTER SECTION (BELAJAR SEKOLAH / RUMAH)
    // ===================================================
    const btnSekolah = document.getElementById('btnSekolah');
    const btnRumah = document.getElementById('btnRumah');
    const sekolahCards = document.querySelectorAll('.card-sekolah');
    const rumahCards = document.querySelectorAll('.card-rumah');

    function showSection(section) {
        if (section === 'sekolah') {
            if (btnSekolah) btnSekolah.classList.add('active');
            if (btnRumah) btnRumah.classList.remove('active');
            sekolahCards.forEach(card => card.style.display = 'block');
            rumahCards.forEach(card => card.style.display = 'none');
            localStorage.setItem('activeStudentSection', 'sekolah');
        } else {
            if (btnRumah) btnRumah.classList.add('active');
            if (btnSekolah) btnSekolah.classList.remove('active');
            sekolahCards.forEach(card => card.style.display = 'none');
            rumahCards.forEach(card => card.style.display = 'block');
            localStorage.setItem('activeStudentSection', 'rumah');
        }
    }

    if (btnSekolah && btnRumah) {
        btnSekolah.addEventListener('click', () => showSection('sekolah'));
        btnRumah.addEventListener('click', () => showSection('rumah'));
        
        // Memuat section aktif yang tersimpan atau default ke 'sekolah'
        const savedSection = localStorage.getItem('activeStudentSection') || 'sekolah';
        showSection(savedSection);
    }
});
