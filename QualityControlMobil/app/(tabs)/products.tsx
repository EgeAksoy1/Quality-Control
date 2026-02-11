import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Combobox paketi

import { API_URL } from '../../config';

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Arama State'leri
  const [searchColumn, setSearchColumn] = useState('productName'); // Varsayılan: Ürün Adı
  const [searchValue, setSearchValue] = useState('');

  // API Endpoint Kökü
  const ENDPOINT = `${API_URL}/product`;

  // --- 1. VERİ TABANI KOLON ADI DÖNÜŞÜMÜ ---
  // Kullanıcı "Ürün Adı" seçer ama biz veritabanına "product_name" göndeririz.
  const getDbColumnName = (key: string) => {
    const mapping: { [key: string]: string } = {
      id: 'id',
      productName: 'product_name',
      brutKg: 'brut_kg',
      bagNo: 'bag_no',
      colourB: 'colour_b',
      colourL: 'colour_l',
      lotNo: 'lot_no',
      netKg: 'net_kg',
      productDate: 'product_date'
    };
    return mapping[key] || key;
  };

  // --- 2. TÜM LİSTEYİ ÇEK ---
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINT}/list`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ARAMA YAP ---
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      // Eğer kutu boşsa tüm listeyi getir
      fetchAllProducts();
      return;
    }

    setLoading(true);
    Keyboard.dismiss(); // Klavyeyi kapat

    try {
      // Seçilen değeri DB formatına çevir (productName -> product_name)
      const dbColumn = getDbColumnName(searchColumn);
      
      // API İsteği: /search/{columnName}/{value}
      const url = `${ENDPOINT}/search/${dbColumn}/${searchValue}`;
      console.log("İstek atılıyor:", url);

      const response = await axios.get(url);
      setProducts(response.data); // Dönen filtrelenmiş listeyi bas

    } catch (error) {
      console.error(error);
      Alert.alert('Sonuç Bulunamadı', 'Aradığınız kriterlere uygun ürün yok.');
      setProducts([]); // Listeyi temizle
    } finally {
      setLoading(false);
    }
  };

  // Sayfa açılınca hepsini getir
  useFocusEffect(
    useCallback(() => {
      // Sayfa her açıldığında arama kutusu boşsa listeyi yenile
      if(searchValue === '') fetchAllProducts();
    }, [])
  );

  // Arama temizleme butonu için
  const clearSearch = () => {
    setSearchValue('');
    fetchAllProducts();
  };

  // --- KART TASARIMI (Butonsuz) ---
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Başlık */}
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.idBadge}>#{item.id}</Text>
      </View>

      <View style={styles.divider} />

      {/* Detaylar */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Bag No: <Text style={styles.value}>{item.bagNo}</Text></Text>
          <Text style={styles.label}>Lot No: <Text style={styles.value}>{item.lotNo}</Text></Text>
          <Text style={styles.label}>Tarih: <Text style={styles.value}>{item.productDate}</Text></Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Net Kg: <Text style={styles.value}>{item.netKg}</Text></Text>
          <Text style={styles.label}>Brüt Kg: <Text style={styles.value}>{item.brutKg}</Text></Text>
        </View>
      </View>

      {/* Alt Renk Bilgileri */}
      <View style={styles.footerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>B: {item.colourB}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#e3f2fd' }]}>
          <Text style={[styles.badgeText, { color: '#1565c0' }]}>L: {item.colourL}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* --- ÜST ARAMA PANELİ --- */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Detaylı Arama</Text>
        
        {/* 1. COMBOBOX (Picker) */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={searchColumn}
            onValueChange={(itemValue) => setSearchColumn(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Ürün Adı" value="productName" />
            <Picker.Item label="Bag No" value="bagNo" />
            <Picker.Item label="Lot No" value="lotNo" />
            <Picker.Item label="Renk B" value="colourB" />
            <Picker.Item label="Renk L" value="colourL" />
            <Picker.Item label="Tarih" value="productDate" />
          </Picker>
        </View>

        {/* 2. TEXTBOX ve BUTONLAR */}
        <View style={styles.inputRow}>
          <TextInput 
            style={styles.input}
            placeholder="Aranacak değer..."
            value={searchValue}
            onChangeText={setSearchValue}
          />
          
          {/* Arama Butonu */}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>

          {/* Temizle Butonu (X) */}
          {searchValue.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearSearch}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* --- LİSTE --- */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={<Text style={styles.emptyText}>Kayıt bulunamadı.</Text>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  
  // Arama Paneli Tasarımı
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 50, // Çentik payı
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  searchTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign:'center' },
  
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    height: 50,
    justifyContent: 'center'
  },
  picker: { width: '100%', height: 50 },

  inputRow: { flexDirection: 'row', gap: 10 },
  input: { 
    flex: 1, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  searchBtn: { 
    backgroundColor: '#007AFF', 
    width: 50, 
    height: 50, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  clearBtn: { 
    backgroundColor: '#FF3B30', 
    width: 50, 
    height: 50, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Liste Alanı
  listContainer: { flex: 1, padding: 15 },
  
  // Kart Tasarımı
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', flex: 1 },
  idBadge: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 12, color: '#666' },
  
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1 },

  label: { fontSize: 13, color: '#95a5a6', marginBottom: 3 },
  value: { fontSize: 14, fontWeight: '600', color: '#34495e' },

  footerRow: { flexDirection: 'row', marginTop: 10, gap: 10 },
  badge: { backgroundColor: '#fff3e0', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#e67e22' },

  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});