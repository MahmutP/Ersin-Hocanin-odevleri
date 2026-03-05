// 1. Elementleri seçelim (Köprüleri kuralım)
const girisKutusu = document.getElementById("veri-kutusu");
const listeKutusu = document.getElementById("liste");

// ÖDEV: Enter Tuşu Desteği
girisKutusu.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        elemanEkle();
    }
});

// 2. Eleman Ekleme Fonksiyonu
function elemanEkle() {
    // KONTROL: Kutucuk boş mu?
    if (girisKutusu.value.trim() === '') { // .trim() baştaki/sondaki boşlukları siler
        alert("Lütfen bir görev yazın!");
    } else {
        // A. YARATMA: Yeni bir <li> elementi oluştur
        let li = document.createElement("li");

        // B. İÇERİK: İçeriğini input'tan al
        let gorevMetni = girisKutusu.value.trim();
        li.innerHTML = gorevMetni;

        // ÖDEV: Öncelik Rengi (Şartlı Biçimlendirme)
        // Eğer girilen metinde "Acil" veya "acil" kelimesi geçiyorsa
        if (gorevMetni.toLowerCase().includes("acil")) {
            li.classList.add("acil");
        }

        // C. MONTAJ: Listeye (<ul> içine) yerleştir
        listeKutusu.appendChild(li);

        // D. SİLME BUTONU YARAT: Yanına çöp kutusu ikonu ekle
        let span = document.createElement("span");
        span.innerHTML = '<i class="fa-solid fa-trash"></i>'; // FontAwesome ikonu
        li.appendChild(span); // Span'i li'nin içine ekle
    }

    // TEMİZLİK: İşlem bitince input kutusunu sıfırla
    girisKutusu.value = "";
    // İmleci tekrar kutuya odakla (Kullanıcı kolaylığı)
    girisKutusu.focus();
}

// 3. LİSTE OLAYLARI (Tıklama ve Silme İşlemleri)
// Event Delegation (Olay Yetkilendirme): Her LI için ayrı fonksiyon yazmak yerine,
// UL'ye bir kulaklık takıp "İçindeki neye tıklanırsa tıklandığı anla" diyoruz.
listeKutusu.addEventListener("click", function (olay) {

    // EĞER tıklanan şey bir LI (Görevin kendisine) ise:
    if (olay.target.tagName === "LI") {
        // classList.toggle() metodu UI etkileşimlerinde tam bir hayat kurtarıcıdır. 
        // Uzun uzun if/else blokları yazıp "Eğer class varsa çıkar, yoksa ekle" demek yerine,
        // bu akıllı anahtar (toggle) fonksiyonu sayesinde tek bir satır kodla işi çözeriz.
        // Bu class tetiklendiğinde CSS dosyamızdaki üstü çizili ve gri arka planlı stile denk gelir.
        olay.target.classList.toggle("yapildi");
    }

    // EĞER tıklanan şey bir SPAN veya İKON (I) ise (Çöp kutusuna tıklandıysa):
    // Neden tek bir kontrol değil de hem SPAN hem de I'yı ("||" operatörüyle) kontrol ediyoruz? 
    // Çünkü eklediğimiz FontAwesome ikonu (<i> etiketi), taşıyıcı bir <span> etiketinin içine gömülüdür.
    // Kullanıcı farenin ucuyla tam ikonun merkezindeki bir piksele tıklarsa bu olay "I", 
    // ikonun milimetrik yanındaki boşluğa tıklarsa olay "SPAN" üzerinden tetiklenir. 
    // Her iki ihtimali de yakalayarak kullanıcının canını sıkacak UI (Kullanıcı Arayüzü) tıklama hatalarını önlemiş oluyoruz.
    else if (olay.target.tagName === "SPAN" || olay.target.tagName === "I") {

        // closest('li') metodu DOM ağacında yukarı doğru tırmanarak arama yapan harika bir DOM fonksiyonudur.
        // Neden basitçe parentNode (Bir üst ebeveyni seç) komutunu kullanmadık? 
        // Çünkü eğer "I" etiketine tıkladıysak onun birinci derece ebeveyni "SPAN"dir. Silersek sadece ikonu sileriz, liste maddesi kalır.
        // closest("li") komutu bizi bu "kim kimin çocuğu, kaç kat yukarı çıkmam gerek?" karmaşasından kurtarır. 
        // Doğrudan hedefi yani kapsayıcı "li" etiketini bulur ve içindeki her şeyi remove() komutuyla DOM'dan ve hafızadan tamamen kazır.
        olay.target.closest("li").remove();
    }

    // Sondaki 'false' parametresi ise Event Bubbling (Olayların içten dışa doğru tetiklenme sırası) durumunu kontrol eder. Varsayılan davranış budur.
}, false);
