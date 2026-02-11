import React, { useState, useEffect } from "react";
import { userActions, productActions, convertColumnName } from "../api";

function User() {
  const [view, setView] = useState("users");

  // --- KULLANICI STATE'LERİ ---
  const [selectedUser, setSelectedUser] = useState({ id: "", username: "", password: "", role: "USER" });
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  // --- ÜRÜN/ANALİZ STATE'LERİ ---
  const [filterCategory, setFilterCategory] = useState("productName");
  const [filterValue, setFilterValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- 1. VERİ ÇEKME FONKSİYONLARI ---
  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const response = await userActions.list();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setSearchLoading(true);
    try {
      const response = await productActions.list(); 
      setFilteredProducts(response.data || []);
    } catch (error) {
      console.error("Veriler yüklenirken hata:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // --- 2. EFFECT'LER ---
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (view === "log") {
      fetchAllProducts();
    }
  }, [view]);

  // --- 3. KULLANICI İŞLEM FONKSİYONLARI ---
  const handleSelect = (user) => setSelectedUser(user);
  const handleClear = () => setSelectedUser({ id: "", username: "", password: "", role: "USER" });

  const handleSaveUser = async () => {
    if (!selectedUser.username || !selectedUser.password) {
      alert("Kullanıcı adı ve şifre boş olamaz!");
      return;
    }
    setUserLoading(true);
    try {
      const userData = { username: selectedUser.username, password: selectedUser.password, role: selectedUser.role };
      if (selectedUser.id) {
        await userActions.update(selectedUser.id, userData);
        alert("Kullanıcı güncellendi!");
      } else {
        await userActions.save(userData);
        alert("Kullanıcı eklendi!");
      }
      await fetchUsers();
      handleClear();
    } catch (error) {
      alert("Hata oluştu!");
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser.id || !window.confirm("Silmek istediğinize emin misiniz?")) return;
    setUserLoading(true);
    try {
      await userActions.delete(selectedUser.id);
      await fetchUsers();
      handleClear();
    } catch (error) {
      alert("Silme hatası!");
    } finally {
      setUserLoading(false);
    }
  };

  // --- 4. ARAMA FONKSİYONU (TAM NOKTA ATIŞI DÜZELTME) ---
  const handleSearch = async () => {
  if (!filterValue.trim()) {
    fetchAllProducts();
    return;
  }

  setSearchLoading(true);
  try {
    const backendColumnName = convertColumnName(filterCategory);
    let finalSearchValue = filterValue;

    // Kullanıcı 11.02.2026 girerse -> 2026-02-11 formatına çevir
    if (filterCategory === "productDate" && filterValue.includes(".")) {
      const parts = filterValue.split(".");
      if (parts.length === 3) {
        // parts[0]=GG, parts[1]=AA, parts[2]=YYYY
        finalSearchValue = `${parts[2]}-${parts[1]}-${parts[2].length === 4 ? parts[0] : parts[2]}`;
        // Daha güvenli hali:
        finalSearchValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    console.log("Sorgulanan Kolon (DB Adı):", backendColumnName); // product_date görmelisin
    console.log("Sorgulanacak Değer:", finalSearchValue); // 2026-02-11 görmelisin

    const response = await productActions.search(backendColumnName, finalSearchValue);
    setFilteredProducts(response.data || []);
    
    if (!response.data || response.data.length === 0) {
      alert("Kayıt bulunamadı. DB Kolon: " + backendColumnName + " | Değer: " + finalSearchValue);
    }
  } catch (error) {
    console.error("Arama hatası:", error);
    alert("Backend hatası!");
  } finally {
    setSearchLoading(false);
  }
};

  return (
    <div className="fade-in">
      {/* ÜST GEZİNTİ ÇUBUĞU */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>
          {view === "users" ? "Admin Paneli - Kullanıcılar" : "Admin Paneli - Laboratuvar Analiz Kayıtları"}
        </h2>
        
        <button 
          className="qc-btn" 
          style={{ backgroundColor: view === "users" ? "#1e3a8a" : "#2563eb", padding: '12px 24px' }}
          onClick={() => {
            setView(view === "users" ? "log" : "users");
            handleClear();
          }}
        >
          {view === "users" ? "📊 Analiz Kayıtlarını Filtrele" : "👥 Kullanıcı Yönetimine Dön"}
        </button>
      </div>

      {view === "users" ? (
        /* KULLANICI YÖNETİMİ */
        <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
          
          <div className="card" style={{ flex: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ color: '#1e3a8a' }}>Kayıtlı Kullanıcılar</h3>
              <button className="qc-btn" style={{ padding: '8px 15px', backgroundColor: '#10b981' }} onClick={handleClear}>
                + Yeni Kullanıcı
              </button>
            </div>
            
            {userLoading ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Yükleniyor...</p>
            ) : (
              <table className="qc-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Username</th><th>Password</th><th>Role</th><th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        Henüz kullanıcı bulunmuyor
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} style={{ backgroundColor: selectedUser.id === u.id ? '#f0f7ff' : 'transparent' }}>
                        <td style={{ fontWeight: 'bold' }}>{u.id}</td>
                        <td>{u.username}</td>
                        <td>••••••</td>
                        <td>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem',
                            backgroundColor: u.role === 'ADMIN' ? '#dcfce7' : '#f1f5f9',
                            color: u.role === 'ADMIN' ? '#166534' : '#475569'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="qc-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }} 
                            onClick={() => handleSelect(u)}
                            disabled={userLoading}
                          >
                            Seç
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="card" style={{ flex: '1', minWidth: '300px', borderTop: selectedUser.id ? '4px solid #3b82f6' : '4px solid #10b981' }}>
            <h3 style={{ color: '#1e3a8a' }}>{selectedUser.id ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '20px' }}>
              {selectedUser.id ? `Düzenlenen ID: ${selectedUser.id}` : "Sisteme yeni erişim tanımlayın."}
            </p>

            <div className="sidebar-nav" style={{ gap: '15px' }}>
              <div className="form-group">
                <label>USERNAME</label>
                <input 
                  className="qc-input" 
                  value={selectedUser.username} 
                  onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                  disabled={userLoading}
                />
              </div>
              <div className="form-group">
                <label>PASSWORD</label>
                <input 
                  className="qc-input" 
                  type="password"
                  value={selectedUser.password} 
                  onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                  disabled={userLoading}
                />
              </div>
              <div className="form-group">
                <label>ROLE</label>
                <select 
                  className="qc-input" 
                  value={selectedUser.role} 
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  disabled={userLoading}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {selectedUser.id ? (
                  <>
                    <button className="qc-btn" onClick={handleSaveUser} disabled={userLoading}>GÜNCELLE</button>
                    <button className="qc-btn" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteUser} disabled={userLoading}>SİL</button>
                    <button onClick={handleClear} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}>Vazgeç</button>
                  </>
                ) : (
                  <button className="qc-btn" style={{ backgroundColor: '#10b981' }} onClick={handleSaveUser} disabled={userLoading}>SİSTEME EKLE</button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LABORATUVAR VERİ ANALİZİ */
        <div className="fade-in">
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', display: 'block', marginBottom: '5px' }}>FİLTRE KRİTERİ</label>
                <select 
                  className="qc-input" 
                  value={filterCategory} 
                  onChange={(e) => { setFilterCategory(e.target.value); setFilterValue(""); }}
                  disabled={searchLoading}
                >
                  <option value="productName">Product Name</option>
                  <option value="lotNo">Lot No</option>
                  <option value="bagNo">Bag No</option>
                  <option value="productDate">Kayıt Tarihi</option>
                  <option value="brutKg">Brut KG</option>
                  <option value="netKg">Net KG</option>
                  <option value="colourL">Colour L</option>
                  <option value="colourB">Colour B</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', display: 'block', marginBottom: '5px' }}>ARANACAK DEĞER</label>
                <input 
                  className="qc-input" 
                  type="text" 
                  placeholder={filterCategory === "productDate" ? "GG.AA.YYYY (Örn: 11.02.2026)" : "Değer yazın..."}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  disabled={searchLoading}
                />
              </div>

              <button 
                className="qc-btn" 
                style={{ height: '46px', minWidth: '150px', backgroundColor: '#10b981' }}
                onClick={handleSearch}
                disabled={searchLoading}
              >
                {searchLoading ? "ARANIYOR..." : "🔍 SORGULA / LİSTELE"}
              </button>
            </div>
          </div>

          <div className="card">
            <table className="qc-table">
              <thead>
                <tr>
                  <th>ID</th><th>Product</th><th>Lot No</th><th>Tarih</th><th>Bag No</th><th>Brut</th><th>Net</th><th>L</th><th>B</th>
                </tr>
              </thead>
              <tbody>
                {searchLoading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Yükleniyor...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Kayıt bulunamadı.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: 'bold' }}>{product.id}</td>
                      <td>{product.productName}</td>
                      <td>{product.lotNo}</td>
                      <td>{product.productDate ? new Date(product.productDate).toLocaleDateString('tr-TR') : "--"}</td>
                      <td>{product.bagNo}</td>
                      <td>{product.brutKg}</td>
                      <td>{product.netKg}</td>
                      <td>{product.colourL || "--"}</td>
                      <td>{product.colourB || "--"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;