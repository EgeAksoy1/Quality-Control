import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Laboratuvar from "./pages/Laboratuvar";
import User from "./pages/User";
import "./styles.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
      setIsAuthenticated(true);
    }
  }, []);

  // Giriş Yapılmamışsa Sadece Login Sayfasını Göster
  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />;
  }

  // Giriş Yapılmışsa Ana Panel Yapısını Göster
  return (
    <div className="dashboard-layout">
      {/* Sol Menü - Rol bilgisini gönder */}
      <Sidebar setIsAuthenticated={setIsAuthenticated} userRole={userRole} />

      {/* Sağ Ana İçerik Alanı */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          
          <Route path="/products" element={<Product />} />
          <Route path="/laboratuvar" element={<Laboratuvar />} />
          
          {/* Admin Paneli sadece ADMIN rolüne açık */}
          <Route 
            path="/user" 
            element={
              userRole === "ADMIN" 
                ? <User /> 
                : <Navigate to="/products" /> // USER ise yönlendir
            } 
          />

          {/* Tanımsız sayfalarda Products'a geri dön */}
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;