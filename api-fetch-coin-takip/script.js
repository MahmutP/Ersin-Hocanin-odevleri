const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COIN_LIST_API = 'https://api.coingecko.com/api/v3/coins/list';
const CHART_API_URL = (coin) => `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coin)}/market_chart?vs_currency=usd&days=7`;

// ortak fetch helper, HTTP hatalarını yakalar
async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }
    return res.json();
}

const listElement = document.getElementById('crypto-list');
const refreshIcon = document.getElementById('refresh-icon');

const coinIcons = {
    bitcoin: '<i class="fa-brands fa-bitcoin crypto-icon icon-bitcoin"></i>',
    ethereum: '<i class="fa-brands fa-ethereum crypto-icon icon-ethereum"></i>',
    dogecoin: '<i class="fa-solid fa-paw crypto-icon icon-dogecoin"></i>'
};

const coinNames = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    dogecoin: 'Dogecoin'
};

const chartColors = {
    bitcoin: 'rgba(247, 147, 26, 1)',
    ethereum: 'rgba(98, 126, 234, 1)',
    dogecoin: 'rgba(194, 166, 51, 1)'
};

let myChart = null;

// Tool function to format numbers as currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
}

// 1. Liste Fiyatlarını Çeken Fonksiyon (opsiyonel coin id)
async function fiyatlariGetir(coinId) {
    listElement.innerHTML = `
        <li class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i> Veriler Yükleniyor...
        </li>
    `;
    refreshIcon.classList.add('spin');

    try {
        let url = API_URL + '?vs_currencies=usd';
        if (coinId) {
            url += `&ids=${encodeURIComponent(coinId)}`;
        } else {
            // fallback very small set to avoid huge result
            url += '&ids=bitcoin,ethereum,dogecoin';
        }
        const veri = await fetchJson(url);
        
        listElement.innerHTML = '';
        if (coinId && veri[coinId]) {
            const price = veri[coinId].usd;
            const formattedPrice = formatCurrency(price);
            const priceClass = price > 50000 ? 'price-high' : 'price-low';
            listElement.innerHTML = `
                <li class="crypto-item">
                    <div class="crypto-info">
                        ${coinIcons[selectedCoin] || ''}
                        <span class="crypto-name">${selectedCoinName || coinId}</span>
                    </div>
                    <div class="crypto-price ${priceClass}">
                        ${formattedPrice}
                    </div>
                </li>
            `;
        } else {
            // if coinId is not provided or not found, show default small set
            const coins = ['bitcoin', 'ethereum', 'dogecoin'];
            coins.forEach(c => {
                if (veri[c]) {
                    const price = veri[c].usd;
                    const formattedPrice = formatCurrency(price);
                    const priceClass = price > 50000 ? 'price-high' : 'price-low';

                    const listItem = document.createElement('li');
                    listItem.className = 'crypto-item';
                    listItem.innerHTML = `
                        <div class="crypto-info">
                            ${coinIcons[c]}
                            <span class="crypto-name">${coinNames[c]}</span>
                        </div>
                        <div class="crypto-price ${priceClass}">
                            ${formattedPrice}
                        </div>
                    `;
                    listElement.appendChild(listItem);
                }
            });
        }
    } catch (hata) {
        console.error("Fiyatlar alınırken hata oluştu:", hata);
        showError('Veriler alınırken bağlantı hatası oluştu. Lütfen sayfayı yenileyin veya internetinizi kontrol edin.');
        listElement.innerHTML = `
            <li class="loading-state" style="color: var(--danger);">
                <i class="fa-solid fa-triangle-exclamation"></i> Bağlantı Hatası!
            </li>
        `;
    } finally {
        setTimeout(() => refreshIcon.classList.remove('spin'), 500);
    }
}

// 2. Grafiği Çizen Fonksiyon
async function grafigiGuncelle(coin) {
    try {
        const cevap = await fetch(CHART_API_URL(coin));
        const veri = await cevap.json();
        
        // Son 7 günün fiyat dizisi (her biri 2 elemanlı: [timestamp, price])
        const prices = veri.prices;
        
        // Etiketleri tarih formatına çevir (örn: 5 Eyl, 6 Eyl)
        const labels = prices.map(p => {
            const date = new Date(p[0]);
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit' });
        });
        
        // Y Eksenine denk gelen fiyatlar
        const dps = prices.map(p => p[1]);
        
        const ctx = document.getElementById('cryptoChart').getContext('2d');
        let color = chartColors[coin];
        if (!color) {
            color = 'rgba(56, 189, 248, 1)'; // fallback accent
        }
        
        // Önceki bir grafik varsa temizle
        if (myChart) {
            myChart.destroy();
        }
        
        // Chart.js kullanarak grafiği başlat
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${coinNames[coin]} (Son 7 Günlük Trend)`,
                    data: dps,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.1)'), // Arkası opak olsun
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1, // Düzleştirilmiş çizgi
                    pointRadius: 0, // Normal zamanlarda noktaları gizle
                    pointHoverRadius: 5 // Fare üzerine gelince noktayı göster
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: { family: "'Outfit', sans-serif" }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { 
                            color: '#a0aec0',
                            maxTicksLimit: 7, // X Ekseninde çok kalabalık durmaması için
                            font: { family: "'Outfit', sans-serif" }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y: {
                        ticks: { 
                            color: '#a0aec0',
                            font: { family: "'Outfit', sans-serif" },
                            callback: function(value) {
                                return '$' + Number.parseFloat(value).toLocaleString();
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x', // Mouse takip efekti
                    intersect: false
                }
            }
        });
    } catch (hata) {
        console.error("Grafik yüklenirken hata oluştu:", hata);
    }
}

// 3. Coin list event handlers (search & selection)
const searchInput = document.getElementById('search-input');
const coinListElement = document.getElementById('coin-list');
let allCoins = [];

searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    let filtered;
    if (!term) {
        filtered = allCoins.slice(0, 100);
    } else {
        filtered = allCoins.filter(c => c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term));
    }
    renderCoinList(filtered);
});

function renderCoinList(coins) {
    if (!coins.length) {
        coinListElement.innerHTML = '<li class="loading-state">kripto bulunamadı</li>';
        return;
    }
    coinListElement.innerHTML = '';
    coins.forEach(coin => {
        const li = document.createElement('li');
        li.className = 'crypto-item coin-entry';
        li.textContent = `${coin.name} (${coin.symbol.toUpperCase()})`;
        li.dataset.id = coin.id;
        li.dataset.name = coin.name;
        li.dataset.symbol = coin.symbol;
        if (coin.id === selectedCoin) {
            li.classList.add('active');
            // ensure visible
            setTimeout(() => li.scrollIntoView({ block: 'center' }), 0);
        }
        li.addEventListener('click', () => {
            selectedCoin = coin.id;
            selectedCoinName = coin.name;
            // update UI highlight
            document.querySelectorAll('.coin-entry').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            fiyatlariGetir(selectedCoin);
            grafigiGuncelle(selectedCoin);
        });
        coinListElement.appendChild(li);
    });
}

async function loadCoinList() {
    try {
        allCoins = await fetchJson(COIN_LIST_API);
        renderCoinList(allCoins.slice(0, 100)); // başlangıçta ilk 100 göster
    } catch (err) {
        console.error('Coin listesi alınamadı', err);
        showError('Coin listesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
        coinListElement.innerHTML = '<li class="loading-state" style="color: var(--danger);">Hata</li>';
    }
}



// GLOBALS
let selectedCoin = 'bitcoin';
let selectedCoinName = 'Bitcoin';

// utility: hata mesajı gösterip yeniden deneme butonu ekler
function showError(message) {
    const errorEl = document.getElementById('error-msg');
    errorEl.innerHTML = `
        <span>${message}</span>
        <button id="error-retry">Yeniden Dene</button>
    `;
    errorEl.style.display = 'flex';
    document.getElementById('error-retry').addEventListener('click', () => {
        errorEl.style.display = 'none';
        // tekrar yükle
        loadCoinList();
        fiyatlariGetir(selectedCoin);
        grafigiGuncelle(selectedCoin);
    });
}

// manuel yenileme butonuna basıldığında sayfa yenilemeden verileri yeniden çeker
const refreshBtn = document.getElementById('refresh-btn');
refreshBtn.addEventListener('click', () => {
    fiyatlariGetir();
    grafigiGuncelle(selectedCoin);
});

document.addEventListener('DOMContentLoaded', () => {
    loadCoinList();
    fiyatlariGetir(selectedCoin);
    grafigiGuncelle(selectedCoin); // Varsayılan: Bitcoin
});
