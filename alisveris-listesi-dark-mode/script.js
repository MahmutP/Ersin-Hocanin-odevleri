// ===== DOM ELEMANLARI =====
const input = document.getElementById("urun-input");
const ul = document.getElementById("liste");
const temaIcon = document.getElementById("tema-icon");

// ===== 1. VERİLERİ TUTACAĞIMIZ DİZİ =====
// Eğer depoda veri varsa onu al (JSON.parse ile), yoksa boş dizi başlat.
let urunler = JSON.parse(localStorage.getItem("alisverisListesi")) || [];

// ===== 2. SAYFA İLK AÇILDIĞINDA =====
sayfaYukle();
temaKontrol();

// Enter tuşu ile de ekleme yapabilme
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        urunEkle();
    }
});

// ===== 3. SAYFA YÜKLEME FONKSİYONU =====
function sayfaYukle() {
    ul.innerHTML = ""; // Önce listeyi temizle

    if (urunler.length === 0) {
        // Boş liste mesajı göster
        let bosMesaj = document.createElement("li");
        bosMesaj.className = "bos-mesaj";
        bosMesaj.textContent = "Listeniz boş. Yukarıdan ürün ekleyin! 🛒";
        bosMesaj.style.justifyContent = "center";
        bosMesaj.style.border = "none";
        bosMesaj.style.background = "transparent";
        bosMesaj.style.boxShadow = "none";
        ul.appendChild(bosMesaj);
        return;
    }

    // Dizideki her ürün için HTML oluştur
    urunler.forEach(function(urun, indeks) {
        let li = document.createElement("li");
        
        let span = document.createElement("span");
        span.textContent = urun;
        
        let silBtn = document.createElement("i");
        silBtn.className = "fa-solid fa-trash";
        silBtn.title = "Ürünü sil";
        silBtn.onclick = function() {
            urunSil(indeks);
        };
        
        li.appendChild(span);
        li.appendChild(silBtn);
        ul.appendChild(li);
    });
}

// ===== 4. ÜRÜN EKLEME =====
function urunEkle() {
    if (input.value.trim() !== "") {
        // A. Diziye ekle
        urunler.push(input.value.trim());

        // B. Depoya kaydet (String'e çevirerek!)
        localStorage.setItem("alisverisListesi", JSON.stringify(urunler));

        // C. Ekrana yansıt
        sayfaYukle();

        // D. Kutuyu temizle ve odakla
        input.value = "";
        input.focus();
    } else {
        alert("Lütfen bir ürün yazın!");
    }
}

// ===== 5. ÜRÜN SİLME =====
function urunSil(indeks) {
    // A. Diziden sil (Splice: belirtilen indeksten 1 tane sil)
    urunler.splice(indeks, 1);

    // B. Güncel halini depoya kaydet
    localStorage.setItem("alisverisListesi", JSON.stringify(urunler));

    // C. Ekrana yansıt
    sayfaYukle();
}

// ===== 6. LİSTEYİ TEMİZLE =====
function listeyiTemizle() {
    // Depodan sadece alışveriş listesini sil
    localStorage.removeItem("alisverisListesi");
    // Diziyi sıfırla
    urunler = [];
    // Ekrana yansıt
    sayfaYukle();
}

// ===== 7. DARK MODE / LIGHT MODE TOGGLE =====
function temaToggle() {
    // body'ye dark-theme class'ını ekle veya çıkar
    document.body.classList.toggle("dark-theme");

    // Durumu localStorage'a kaydet
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("tema", "dark");
        temaIcon.className = "fa-solid fa-sun";
    } else {
        localStorage.setItem("tema", "light");
        temaIcon.className = "fa-solid fa-moon";
    }
}

// Sayfa yüklendiğinde tema tercihini kontrol et
function temaKontrol() {
    let kayitliTema = localStorage.getItem("tema");

    if (kayitliTema === "dark") {
        document.body.classList.add("dark-theme");
        temaIcon.className = "fa-solid fa-sun";
    } else {
        document.body.classList.remove("dark-theme");
        temaIcon.className = "fa-solid fa-moon";
    }
}

// ===== 8. TÜM LOCALSTORAGE'I TEMİZLE =====
// Bu buton dark mode tercihi dahil HER ŞEYİ siler.
function storageTamamenTemizle() {
    // localStorage.clear() -> Sitemize ait tüm depoyu siler
    localStorage.clear();

    // Diziyi sıfırla
    urunler = [];

    // Temayı light'a döndür
    document.body.classList.remove("dark-theme");
    temaIcon.className = "fa-solid fa-moon";

    // Listeyi yeniden çiz
    sayfaYukle();
}
