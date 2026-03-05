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

// Ağaç Elementleri
const agacGovde = document.getElementById("agac-govde");
const agacYapraklari = document.getElementById("agac-yapraklari");
const agacDali = document.getElementById("agac-dali");
const adamAsmaca = document.getElementById("adam-asmaca");

// Adam Asmaca Parçaları
let adamParcalari = [];
document.addEventListener("DOMContentLoaded", () => {
    adamParcalari = [
        "adam-ip",
        "adam-kafa",
        "adam-govde",
        "adam-sol-kol",
        "adam-sag-kol",
        "adam-sol-bacak",
        "adam-sag-bacak"
    ].map(id => document.getElementById(id));
});

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
    let oncelikSecimi = document.getElementById("oncelik-secimi");
    let oncelikDegeri = oncelikSecimi ? parseInt(oncelikSecimi.value) : 2;

    if (gorevMetni === '') {
        alert("Lütfen bir görev yazın!");
        return;
    }

    const simdi = new Date();
    const saatMetni = simdi.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });

    // Görev objesi oluştur
    const yeniGorev = {
        id: Date.now(), // Benzersiz ID
        metin: gorevMetni,
        yapildi: false,
        acil: gorevMetni.toLowerCase().includes("acil"),
        oncelik: oncelikDegeri,
        saat: saatMetni,
        zamanDamgasi: simdi.getTime()
    };

    gorevler.push(yeniGorev);

    // Listeyi önceliğe göre sırala: Yüksek öncelikler üstte, öncelik eşitse yeni eklenenler üstte.
    gorevler.sort((a, b) => {
        if (b.oncelik !== a.oncelik) {
            return b.oncelik - a.oncelik;
        }
        return b.zamanDamgasi - a.zamanDamgasi;
    });

    // Yeni eklenen görevin olduğu sayfayı bul
    const indeks = gorevler.findIndex(g => g.id === yeniGorev.id);
    mevcutSayfa = Math.floor(indeks / sayfaBasinaGorev) + 1;

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

        // Öncelik ikonu ve rengi
        let oncelikIkonu = "";
        let oncelikSinifi = "";
        if (gorev.oncelik === 3) {
            oncelikIkonu = '<i class="fa-solid fa-fire text-danger" style="color:#e74c3c;"></i>';
            oncelikSinifi = "oncelik-yuksek";
        } else if (gorev.oncelik === 2) {
            oncelikIkonu = '<i class="fa-solid fa-bolt text-warning" style="color:#f39c12;"></i>';
            oncelikSinifi = "oncelik-orta";
        } else {
            oncelikIkonu = '<i class="fa-solid fa-leaf text-success" style="color:#2ecc71;"></i>';
            oncelikSinifi = "oncelik-dusuk";
        }

        li.classList.add(oncelikSinifi);

        let icerikHTML = `
            <div class="gorev-sol">
                <span class="oncelik-ikonu">${oncelikIkonu}</span>
                <span class="gorev-metni">${gorev.metin}</span>
            </div>
            <div class="gorev-sag">
                <span class="gorev-saati"><i class="fa-regular fa-clock"></i> ${gorev.saat}</span>
            </div>
        `;

        li.innerHTML = icerikHTML;

        if (gorev.acil) li.classList.add("acil");
        if (gorev.yapildi) li.classList.add("yapildi");

        let ikonKapsayici = document.createElement("span");
        ikonKapsayici.className = "sil-buton";
        ikonKapsayici.innerHTML = '<i class="fa-solid fa-trash"></i>';
        li.querySelector(".gorev-sag").appendChild(ikonKapsayici);

        listeKutusu.appendChild(li);
    });

    // 5. Sayfalama kontrollerini güncelle
    sayfaBilgisi.innerText = `${mevcutSayfa} / ${toplamSayfa}`;
    oncekiBtn.disabled = mevcutSayfa === 1;
    sonrakiBtn.disabled = mevcutSayfa === toplamSayfa;

    // 6. Ağaç Animasyonunu Tetikle
    agaciGuncelle();
}

// Ağaç Büyüme ve Yapraklanma Mantığı
function agaciGuncelle() {
    // DOM'dan henüz alınmamışsa almayı dene (ilk çalışmada DOMContentLoaded'dan önce çalışabilir)
    if (adamParcalari.length === 0) {
        adamParcalari = [
            "adam-ip", "adam-kafa", "adam-govde",
            "adam-sol-kol", "adam-sag-kol", "adam-sol-bacak", "adam-sag-bacak"
        ].map(id => document.getElementById(id));
    }

    const tamamlananSayisi = gorevler.filter(g => g.yapildi).length;
    const bekleyenSayisi = gorevler.length - tamamlananSayisi;

    // 1. Gövde Büyüme Aşaması (0-3 Görev)
    agacGovde.className = "agac-govde"; // Sınıfları sıfırla

    if (bekleyenSayisi === 0) {
        agacGovde.classList.add("evre-0");
    } else if (bekleyenSayisi === 1) {
        agacGovde.classList.add("evre-1");
    } else if (bekleyenSayisi === 2) {
        agacGovde.classList.add("evre-2");
    } else if (bekleyenSayisi >= 3) {
        agacGovde.classList.add("evre-3");
    }

    // 2. Adam Asmaca Kısmı (4 ve daha fazla bekleyen görev)
    if (adamParcalari[0]) {
        adamParcalari.forEach(p => {
            if (p) p.classList.remove("goster-parca");
        });
    }

    if (agacDali && adamAsmaca) {
        if (bekleyenSayisi >= 4) {
            agacDali.classList.add("goster");
            adamAsmaca.classList.add("goster");

            const asimAsamasi = bekleyenSayisi - 3; // 4.görevde 1, 5'te 2..

            for (let i = 0; i < Math.min(asimAsamasi, adamParcalari.length); i++) {
                if (adamParcalari[i]) adamParcalari[i].classList.add("goster-parca");
            }

            // Asılma Tamamlandı Uyarısı
            if (asimAsamasi >= adamParcalari.length && !adamAsmaca.dataset.uyarildi) {
                adamAsmaca.dataset.uyarildi = "true";
                setTimeout(() => alert("Adam asıldı! Lütfen biraz görev tamamla 😱"), 500);
            } else if (asimAsamasi < adamParcalari.length) {
                adamAsmaca.dataset.uyarildi = "";
            }
        } else {
            agacDali.classList.remove("goster");
            adamAsmaca.classList.remove("goster");
            adamAsmaca.dataset.uyarildi = "";
        }
    }

    // 3. Yapraklanma Açma kısmı iptal edildi (yapraklar UI'ı bozduğu için kaldırıldı)
    agacYapraklari.innerHTML = ""; // Varsa önceki yaprakları temizle
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
