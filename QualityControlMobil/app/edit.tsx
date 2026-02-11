import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Combobox paketi

// MERKEZİ CONFIG DOSYASINDAN IP ÇEKİYORUZ
// (app klasörünün içinde olduğumuz için bir üstteki config'e çıkıyoruz: ../)
import { API_URL } from '../config';

export default function EditUser() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // State'ler
  const [username, setUsername] = useState(params.username as string);
  const [password, setPassword] = useState(params.password as string);
  // Rol null gelirse varsayılan USER olsun, gelirse büyük harfe çevir
  const [role, setRole] = useState(params.role ? (params.role as string).toUpperCase() : 'USER');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Backend'e gidecek veri paketi
      const updatedUser = {
        username: username,
        password: password,
        role: role 
      };

      // DİNAMİK URL KULLANIMI
      // Örn: http://192.168.1.XX:8080/rest/api/user/update/5
      const url = `${API_URL}/user/update/${params.id}`;
      
      console.log("Güncelleme isteği atılıyor:", url);

      await axios.put(url, updatedUser);

      Alert.alert('Başarılı', 'Kullanıcı başarıyla güncellendi!', [
        { text: 'Tamam', onPress: () => router.back() } // Listeye geri dön
      ]);

    } catch (error) {
      console.error("Güncelleme Hatası:", error);
      Alert.alert('Hata', 'Güncelleme işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Düzenle</Text>
      <Text style={styles.subTitle}>Kullanıcı ID: {params.id}</Text>

      {/* KULLANICI ADI */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kullanıcı Adı</Text>
        <TextInput 
          style={styles.input} 
          value={username} 
          onChangeText={setUsername} 
          placeholder="Kullanıcı adı giriniz"
        />
      </View>

      {/* ŞİFRE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Şifre</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword}
          placeholder="Yeni şifre (Değişmeyecekse aynı kalsın)" 
        />
      </View>

      {/* ROL SEÇİMİ (COMBOBOX) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Rol</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="USER (Standart)" value="USER" />
            <Picker.Item label="ADMIN (Yönetici)" value="ADMIN" />
          </Picker>
        </View>
      </View>

      {/* BUTONLAR */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Kaydet ve Güncelle</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.btnText}>İptal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color:'#333' },
  subTitle: { fontSize: 14, textAlign: 'center', color: 'gray', marginBottom: 30 },
  
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8, fontWeight: 'bold', color: '#333', fontSize: 16 },
  
  // Input Stili
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 15, 
    fontSize: 16, 
    backgroundColor: '#f8f9fa' 
  },
  
  // Picker (Combobox) Çerçevesi
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center', 
    height: 55 // Yüksekliği sabitledik ki düzgün dursun
  },
  picker: {
    height: 55,
    width: '100%',
  },

  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  cancelButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});