import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // İkon paketi

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, // Üstteki varsayılan başlığı gizle (biz kendimiz ekliyoruz)
      tabBarActiveTintColor: '#007AFF', // Seçili sekme rengi
    }}>
      
      {/* 1. SEKME: KULLANICILAR */}
      <Tabs.Screen 
        name="users" // Dosya adı 'users.tsx' olduğu için burası 'users' olmalı
        options={{
          title: 'Kullanıcılar',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }} 
      />

      {/* 2. SEKME: ÜRÜNLER */}
      <Tabs.Screen 
        name="products" // Birazdan oluşturacağımız dosya
        options={{
          title: 'Ürünler',
          tabBarIcon: ({ color }) => <Ionicons name="cube" size={24} color={color} />,
        }} 
      />
    </Tabs>
  );
}