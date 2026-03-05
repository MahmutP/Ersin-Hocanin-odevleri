const girisKutusu = document.getElementById("veri-kutusu");
const listeKutusu = document.getElementById("liste");
const sayfalamaAlani = document.getElementById("sayfalama");
const oncekiBtn = document.getElementById("onceki-btn");
const sonrakiBtn = document.getElementById("sonraki-btn");
const sayfaBilgisi = document.getElementById("sayfa-bilgisi");

// İstatistik Elementleri
const istatistiklerKutusu = document.getElementById("istatistikler");
const toplamGorevElementi = document.getElementById("toplam-gorev");
const tamamlananGorevElementi = document.getElementById("tamamlanan-gorev");

// STATE (Durum Yönetimi)
let gorevler = [];
let mevcutSayfa = 1;
const sayfaBasinaGorev = 5;

// Enter Tuşu Desteği
girisKutusu.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        elemanEkle();
    }
});

// Yeni Eleman Ekleme
function elemanEkle() {
    let gorevMetni = girisKutusu.value.trim();

    if (gorevMetni === '') {
        alert("Lütfen bir görev yazın!");
        return;
    }

    // Görev objesi oluştur
    const yeniGorev = {
        id: Date.now(), // Benzersiz ID
        metin: gorevMetni,
        yapildi: false,
        acil: gorevMetni.toLowerCase().includes("acil")
    };

    gorevler.push(yeniGorev);

    // Yeni eklenen görevin olduğu son sayfaya git
    mevcutSayfa = Math.ceil(gorevler.length / sayfaBasinaGorev);

    girisKutusu.value = "";
    girisKutusu.focus();

    arayuzuGuncelle();
}

// Arayüzü Çizme (Render) İşlemi
function arayuzuGuncelle() {
    // 1. Listeyi temizle
    listeKutusu.innerHTML = "";

    // 2. Eğer görev yoksa sayfalama ve istatistik alanını gizle
    if (gorevler.length === 0) {
        sayfalamaAlani.style.display = "none";
        istatistiklerKutusu.style.display = "none";
        return;
    }

    sayfalamaAlani.style.display = "flex";
    istatistiklerKutusu.style.display = "flex";

    // İstatistikleri Hesapla ve Yaz
    const tamamlananSayisi = gorevler.filter(g => g.yapildi).length;
    toplamGorevElementi.innerText = `Toplam: ${gorevler.length}`;
    tamamlananGorevElementi.innerText = `Tamamlanan: ${tamamlananSayisi}`;

    // 3. Sayfalama matematiği
    const toplamSayfa = Math.ceil(gorevler.length / sayfaBasinaGorev);

    // Eğer mevcut sayfa silmelerden dolayı toplam sayfadan büyük olduysa geri çek
    if (mevcutSayfa > toplamSayfa) {
        mevcutSayfa = toplamSayfa;
    }

    const baslangicIndeksi = (mevcutSayfa - 1) * sayfaBasinaGorev;
    const bitisIndeksi = baslangicIndeksi + sayfaBasinaGorev;

    // Sadece bu sayfanın görevlerini al
    const sayfadakiGorevler = gorevler.slice(baslangicIndeksi, bitisIndeksi);

    // 4. Görevleri ekrana bas
    sayfadakiGorevler.forEach(gorev => {
        let li = document.createElement("li");
        li.dataset.id = gorev.id; // ID'yi HTML'e göm
        li.innerHTML = `<span>${gorev.metin}</span>`; // Metni span içine alarak ikonla mesafesini koru

        if (gorev.acil) li.classList.add("acil");
        if (gorev.yapildi) li.classList.add("yapildi");

        let ikonKapsayici = document.createElement("span");
        ikonKapsayici.className = "sil-buton";
        ikonKapsayici.innerHTML = '<i class="fa-solid fa-trash"></i>';
        li.appendChild(ikonKapsayici);

        listeKutusu.appendChild(li);
    });

    // 5. Sayfalama kontrollerini güncelle
    sayfaBilgisi.innerText = `${mevcutSayfa} / ${toplamSayfa}`;
    oncekiBtn.disabled = mevcutSayfa === 1;
    sonrakiBtn.disabled = mevcutSayfa === toplamSayfa;
}

// Sayfa Değiştirme Fonksiyonu
// Global erişilebilirlik için window objesine ekliyoruz (HTML'deki onclick yüzünden)
window.sayfaDegistir = function (yon) {
    mevcutSayfa += yon;
    arayuzuGuncelle();
}

// Liste Olayları (Tıklama ve Silme)
listeKutusu.addEventListener("click", function (olay) {
    // Tıklanan li elementini bul ve ID'sini al
    const liEleman = olay.target.closest("li");
    if (!liEleman) return;

    const gorevId = parseInt(liEleman.dataset.id);

    // Silme ikonuna tıklanmışsa (.sil-buton classlı span veya içindeki i)
    if (olay.target.closest('.sil-buton')) {
        gorevler = gorevler.filter(g => g.id !== gorevId);
        arayuzuGuncelle();
    }
    // Görevin kendisine tıklanmışsa (tamamlandı/yapıldı)
    else if (olay.target.closest("li")) {
        const gorev = gorevler.find(g => g.id === gorevId);
        if (gorev) {
            gorev.yapildi = !gorev.yapildi;
            arayuzuGuncelle();
        }
    }
}, false);

// İlk açılışta boş UI
arayuzuGuncelle();
