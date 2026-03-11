import { useState, useEffect } from "react";
import "./Ramazan.css";
import cities from "./cities.json";

const Ramazan = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [districtId, setDistrictId] = useState(null);
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [locationStatus, setLocationStatus] = useState("Konum alınıyor...");

    // Helper to find closest city name match or default
    const findCityIdByName = (name) => {
        const uppercaseName = name.toUpperCase().replace(/İ/g, "I").replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ş/g, "S").replace(/Ö/g, "O").replace(/Ç/g, "C");
        const found = cities.find(c => 
            c.SehirAdiEn.toUpperCase().includes(uppercaseName) || 
            c.SehirAdi.toUpperCase().includes(uppercaseName)
        );
        return found ? found : cities.find(c => c.SehirAdi === "İSTANBUL"); // Default to Istanbul
    };

    // 1. Get User Location on Mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // Reverse geocoding to get city name
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        const city = data.address.province || data.address.city || "İstanbul";
                        
                        const cityObj = findCityIdByName(city);
                        setSelectedCity(cityObj);
                    } catch (error) {
                        console.error("Location error:", error);
                        setLocationStatus("Konum bulunamadı, varsayılan şehir yükleniyor.");
                        setSelectedCity(cities.find(c => c.SehirAdi === "İSTANBUL"));
                    }
                },
                (error) => {
                    console.error("Geolocation denied:", error);
                    setLocationStatus("Konum izni verilmedi.");
                    setSelectedCity(cities.find(c => c.SehirAdi === "İSTANBUL"));
                }
            );
        } else {
            setLocationStatus("Tarayıcı konum servisini desteklemiyor.");
            setSelectedCity(cities.find(c => c.SehirAdi === "İSTANBUL"));
        }
    }, []);

    // 2. Fetch District and Times when Selected City Changes
    useEffect(() => {
        if (!selectedCity) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch districts for the city
                const districtRes = await fetch(`https://ezanvakti.emushaf.net/ilceler/${selectedCity.SehirID}`);
                const districts = await districtRes.json();

                // Find Central District (usually same name as city) or first one
                let targetDistrict = districts.find(d => d.IlceAdi === selectedCity.SehirAdi);
                if (!targetDistrict) targetDistrict = districts[0];

                setDistrictId(targetDistrict.IlceID);

                // Fetch Times
                const timesRes = await fetch(`https://ezanvakti.emushaf.net/vakitler/${targetDistrict.IlceID}`);
                const timesData = await timesRes.json();
                setTimes(timesData);
            } catch (error) {
                console.error("Data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCity]);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setSidebarOpen(false); // Close sidebar on mobile after selection
    };

    // Filter for Ramazan data
    const ramazanDays = times.filter((item) => item.HicriTarihUzun.includes("Ramazan"));

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h3>Şehirler</h3>
                    <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
                </div>
                <ul className="city-list">
                    {cities.map(city => (
                        <li 
                            key={city.SehirID} 
                            className={selectedCity?.SehirID === city.SehirID ? "active" : ""}
                            onClick={() => handleCitySelect(city)}
                        >
                            {city.SehirAdi}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰ Şehir Seç</button>
                
                <header className="header">
                    <h1>Ramazan İmsakiyesi 2026</h1>
                    {selectedCity && <h2>{selectedCity.SehirAdi}</h2>}
                    {!selectedCity && <p className="status-text">{locationStatus}</p>}
                </header>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Vakitler Yükleniyor...</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {ramazanDays.length > 0 ? ramazanDays.map((item) => (
                            <div key={item.MiladiTarihKisa} className="day-card">
                                <div className="date-header">{item.MiladiTarihUzun}</div>
                                <div className="times-wrapper">
                                    <div className="time-row sahur">
                                        <span className="label">İmsak (Sahur)</span>
                                        <span className="time">{item.Imsak}</span>
                                    </div>
                                    <div className="time-row iftar">
                                        <span className="label">Akşam (İftar)</span>
                                        <span className="time">{item.Aksam}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="no-data">Ramazan verisi bulunamadı veya tarih dışı.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ramazan;