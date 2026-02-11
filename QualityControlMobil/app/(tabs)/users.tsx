import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router'; // useFocusEffect eklendi
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // İkonlar için
import { API_URL } from '../../config';

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'http://192.168.1.114:8080/rest/api/user';

  // Verileri Çeken Fonksiyon
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/list`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Veriler çekilemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Bu sayfa her odaklandığında (Edit'ten dönünce dahil) çalışır
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  // SİLME İŞLEMİ
  const handleDelete = (id: number) => {
    Alert.alert('Silme Onayı', 'Bu kullanıcıyı silmek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      { 
        text: 'Sil', 
        style: 'destructive', 
        onPress: async () => {
          try {
            // Delete API isteği
            await axios.delete(`${BASE_URL}/delete/${id}`);
            Alert.alert('Silindi', 'Kullanıcı başarıyla silindi.');
            fetchUsers(); // Listeyi güncelle
          } catch (error) {
            Alert.alert('Hata', 'Silme işlemi başarısız.');
          }
        }
      }
    ]);
  };

  // DÜZENLEME İŞLEMİ (Sayfa Yönlendirme)
  const handleEdit = (item: any) => {
    // Edit sayfasına verileri gönderiyoruz
    router.push({
      pathname: '/edit' as any,
      params: { 
        id: item.id, 
        username: item.username, 
        password: item.password, 
        role: item.role 
      }
    });
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      {/* VERİLER */}
      <View style={styles.dataContainer}>
        <Text style={styles.cellText}><Text style={{fontWeight:'bold'}}>ID:</Text> {item.id}</Text>
        <Text style={styles.cellText}>{item.username}</Text>
        <Text style={styles.cellText}>{item.role}</Text>
      </View>

      {/* BUTONLAR (SAĞ TARAFTA) */}
      <View style={styles.actionButtons}>
        {/* Düzenle Butonu (Mavi Kalem) */}
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>

        {/* Sil Butonu (Kırmızı Çöp Kutusu) */}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Listesi</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Alt Çıkış Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  
  // Satır Tasarımı
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  evenRow: { backgroundColor: '#fff' },
  oddRow: { backgroundColor: '#fff' },

  dataContainer: { flex: 1 },
  cellText: { fontSize: 14, color: '#333', marginBottom: 2 },

  actionButtons: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#007AFF', padding: 8, borderRadius: 5 },
  deleteBtn: { backgroundColor: '#FF3B30', padding: 8, borderRadius: 5 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  logoutButton: { backgroundColor: '#555', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});