import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../config';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen kullanıcı adı ve şifreyi gir.');
      return;
    }

    setLoading(true);

    try {
      // Backend IP Adresin (Kendi IP'ni kontrol et)
      const url = `${API_URL}/user/login/${username}/${password}`;      
      console.log("İstek atılıyor:", url);

      const response = await axios.get(url);

      // Backend'den null dönmediyse (Kullanıcı varsa)
      if (response.data) {
        const user = response.data;
        console.log("Giriş Yapan:", user.username, "Rolü:", user.role);

        // --- BURASI KRİTİK NOKTA: ROL KONTROLÜ ---
        // Veritabanında rolün 'ADMIN' mi 'admin' mi kayıtlı olduğunu bilmediğim için
        // ikisini de kontrol ediyorum. Veya 'toUpperCase()' ile büyütüp bakıyoruz.
        
        if (user.role && user.role.toUpperCase() === 'ADMIN') {
          // Eğer Admins, içeri al
          router.replace('/(tabs)/users' as any); 
        } else {
          // Şifre doğru olsa bile Admin değilse hata ver
          Alert.alert('Yetkisiz Giriş', 'Bu panele sadece ADMIN yetkisi olanlar girebilir.');
        }

      } else {
        Alert.alert('Giriş Başarısız', 'Kullanıcı bulunamadı veya şifre yanlış.');
      }
      
    } catch (error) {
      console.error("Hata Detayı:", error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı. IP adresini kontrol et.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Giriş</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Kullanıcı Adı</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Kullanıcı adınız"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Şifre</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Şifreniz"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { marginBottom: 5, fontWeight: '600', color: '#555' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});