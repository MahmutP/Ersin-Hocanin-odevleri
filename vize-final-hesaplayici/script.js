document.addEventListener('DOMContentLoaded', () => {
    const hesaplaBtn = document.getElementById('hesaplaBtn');
    const vizeInput = document.getElementById('vize');
    const finalInput = document.getElementById('final');
    const sonucAlani = document.getElementById('sonucAlani');

    hesaplaBtn.addEventListener('click', () => {
        // vize ve final değerlerini .value ile alıyoruz
        const vizeNotu = Number(vizeInput.value);
        const finalNotu = Number(finalInput.value);

        // Boş veya geçersiz giriş kontrolü
        if (vizeInput.value === '' || finalInput.value === '') {
            sonucAlani.innerHTML = `<span style="color: #e53e3e; font-size: 1rem;">Lütfen her iki notu da giriniz.</span>`;
            return;
        }

        if (vizeNotu < 0 || vizeNotu > 100 || finalNotu < 0 || finalNotu > 100) {
            sonucAlani.innerHTML = `<span style="color: #e53e3e; font-size: 1rem;">Notlar 0 ile 100 arasında olmalıdır.</span>`;
            return;
        }

        // Formül: (Vize Notu * 0.4) + (Final Notu * 0.6)
        const ortalama = (vizeNotu * 0.4) + (finalNotu * 0.6);

        // Karar Mekanizması
        let sonucMesaji = '';
        let sonucSinifi = '';

        if (ortalama > 50) {
            sonucMesaji = 'GEÇTİ';
            sonucSinifi = 'pass'; // Yeşil
        } else {
            sonucMesaji = 'KALDI';
            sonucSinifi = 'fail'; // Kırmızı
        }

        // Sonucu ekrana yazdırma
        sonucAlani.innerHTML = `
            <div class="average-text">Ortalama: ${ortalama.toFixed(2)}</div>
            <div class="result-text ${sonucSinifi}">${sonucMesaji}</div>
        `;
    });
});
