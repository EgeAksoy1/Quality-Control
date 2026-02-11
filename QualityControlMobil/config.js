// config.js
import Constants from 'expo-constants';

// --- AYARLAR ---
// Eğer otomatik bulamazsa devreye girecek YEDEK IP (Bilgisayarının şu anki IP'si)
const MANUAL_IP = "192.168.1.118"; 
const PORT = "8080"; 

const getApiUrl = () => {
  // 1. Expo'nun çalıştığı IP'yi almaya çalış
  // (hostUri genelde "192.168.1.35:8081" gibi bir şey döner)
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    // IP'yi bulduysa onu ayıkla
    const ip = debuggerHost.split(':')[0];
    console.log(`[Config] Otomatik IP Bulundu: ${ip}`);
    return `http://${ip}:${PORT}/rest/api`;
  }

  // 2. Bulamazsa YEDEK IP'yi kullan
  console.log(`[Config] Otomatik IP Bulunamadı! Yedek IP (${MANUAL_IP}) kullanılıyor.`);
  return `http://${MANUAL_IP}:${PORT}/rest/api`;
};

// Dışarıya tek bir adres ver
export const API_URL = getApiUrl();