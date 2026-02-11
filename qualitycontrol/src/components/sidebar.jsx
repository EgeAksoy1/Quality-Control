import React from "react";
import { NavLink } from "react-router-dom";
import MyCustomIcon from "../logo.png"; // Logo import edildi

function Sidebar({ setIsAuthenticated, userRole }) {
  // LocalStorage'dan kullanıcı adını al
  const username = localStorage.getItem("username") || "Kullanıcı";

  // Kullanıcı rolüne göre menüleri filtrele
  const allMenus = [
    { name: "Ürün Ekleme", path: "/products", allowedRoles: ["ADMIN", "USER"] },
    { name: "Laboratuvar", path: "/laboratuvar", allowedRoles: ["ADMIN", "USER"] },
    { name: "Admin Paneli", path: "/user", allowedRoles: ["ADMIN"] } // Sadece ADMIN görebilir
  ];

  // Kullanıcının rolüne göre erişebileceği menüleri filtrele
  const menus = allMenus.filter(menu => menu.allowedRoles.includes(userRole));

  const handleLogout = () => {
    if(window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      setIsAuthenticated(false);
      // LocalStorage'ı temizle
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
    }
  };

  return (
    <aside className="sidebar">
      {/* Üst Logo ve Başlık */}
      <div className="sidebar-header">
        {/* LOGO KISMI */}
        <div className="sidebar-logo-icon">
          <img 
            src={MyCustomIcon} 
            alt="Logo" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              padding: '5px'
            }}
          />
        </div>
        
        <h1 className="sidebar-title">QC PANEL</h1>
        {/* Kullanıcı adını göster */}
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '8px', fontWeight: '500' }}>
          {username}
        </p>
      </div>
      
      {/* Menü Butonları */}  
      <nav className="sidebar-nav">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            {menu.name}
          </NavLink>
        ))}
      </nav>
      
      {/* Sağ Alt Köşeye Yaslanmış Çıkış Butonu */}
      <div className="sidebar-footer">
        <button 
          className="logout-btn" 
          onClick={handleLogout}
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;