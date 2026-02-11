import React, { useState } from "react";
import MyCustomIcon from "../logo.png"; 
import { userActions } from "../api";

function Login({ setIsAuthenticated, setUserRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await userActions.login(username, password);
      
      if (response.data && response.data.role) {
        // Kullanıcı rolünü kaydet
        setUserRole(response.data.role);
        setIsAuthenticated(true);
        
        // LocalStorage'a kaydet (opsiyonel - tarayıcı kapanınca unutmasın)
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("username", response.data.username);
      } else {
        alert("Giriş başarısız! Kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Login hatası:", error);
      alert("Hatalı kullanıcı adı veya şifre!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="login-box">
        
        <div className="login-icon-wrapper">
          <img 
            src={MyCustomIcon} 
            alt="Logo" 
            className="login-custom-img" 
          />
        </div>
        
        <h2 className="login-title">Hoş Geldiniz</h2>
        <p className="login-subtitle">Kalite Kontrol Paneline erişmek için lütfen giriş yapın.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="large-label" htmlFor="username">KULLANICI ADI</label>
            <input 
              id="username"
              type="text" 
              className="qc-input large-input"
              placeholder="Kullanıcı adınız"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="large-label" htmlFor="password">ŞİFRE</label>
            <input 
              id="password"
              type="password" 
              className="qc-input large-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="qc-btn login-btn-large"
            disabled={loading}
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "SİSTEME GİRİŞ YAP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;