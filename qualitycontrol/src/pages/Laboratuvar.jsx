import React, { useState, useEffect } from "react";
import { productActions } from "../api";

function Laboratuvar() {
  const [selectedId, setSelectedId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [colourL, setColourL] = useState("");
  const [colourB, setColourB] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productActions.list();
      console.log("✅ Çekilen ürünler:", response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error("❌ Ürünler yüklenirken hata:", error);
      alert("Ürünler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (product) => {
    console.log("🔵 Seçilen ürün:", product);
    setSelectedId(product.id);
    setColourL(product.colourL || "");
    setColourB(product.colourB || "");
  };

  const handleUpdate = async () => {
  if (!selectedId) {
    alert("Lütfen bir kayıt seçiniz!");
    return;
  }

  setUpdateLoading(true);

  try {
    // Mevcut listeden seçili ürünün orijinal halini bul
    const originalProduct = products.find(p => p.id === selectedId);

    // Backend'e gönderilecek veri: Orijinal veriler + yeni analiz değerleri
    const updateData = {
      ...originalProduct, // Diğer tüm alanları (name, lotNo vb.) koru
      colourL: parseFloat(colourL),
      colourB: parseFloat(colourB)
    };

    console.log("📤 Backend'e giden tam veri:", updateData);

    const response = await productActions.update(selectedId, updateData);
    
    if (response.status === 200 || response.status === 204 || response.data) {
      alert(`Kayıt başarıyla güncellendi!`);
      await fetchProducts(); // Listeyi yenile
      setSelectedId("");
      setColourL("");
      setColourB("");
    }
  } catch (error) {
    console.error("❌ Güncelleme hatası:", error.response?.data || error.message);
    alert("Kayıt güncellenirken bir hata oluştu. Veri tiplerini kontrol edin.");
  } finally {
    setUpdateLoading(false);
  }
};

  return (
    <div className="fade-in">
      <h2 className="page-title">Laboratuvar Analizleri</h2>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
        
        <div className="card" style={{ flex: '3' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e3a8a' }}>Analiz Listesi</h3>
          
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Yükleniyor...</p>
          ) : (
            <table className="qc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Lot No</th>
                  <th>Bag No</th>
                  <th>Brut</th>
                  <th>Net</th>
                  <th>L</th>
                  <th>B</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      Henüz ürün bulunmuyor
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} style={{ backgroundColor: selectedId === product.id ? '#f0f7ff' : 'transparent' }}>
                      <td style={{ fontWeight: 'bold' }}>{product.id}</td>
                      <td>{product.productName}</td>
                      <td>{product.lotNo}</td>
                      <td>{product.bagNo}</td>
                      <td>{product.brutKg}</td>
                      <td>{product.netKg}</td>
                      <td style={{ color: product.colourL ? '#000' : '#2563eb' }}>
                        {product.colourL || "--"}
                      </td>
                      <td style={{ color: product.colourB ? '#000' : '#2563eb' }}>
                        {product.colourB || "--"}
                      </td>
                      <td>
                        <button 
                          className="qc-btn" 
                          style={{ padding: '6px 15px', fontSize: '0.8rem' }}
                          onClick={() => handleSelect(product)}
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

        <div className="card" style={{ flex: '1', minWidth: '280px', position: 'sticky', top: '20px' }}>
          <h3 style={{ marginBottom: '5px', color: '#1e3a8a' }}>Analiz Girişi</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
            Seçili ID üzerinden analiz değerlerini güncelleyin.
          </p>

          <div className="sidebar-nav" style={{ gap: '15px' }}>
            
            <div className="form-group">
              <label>SEÇİLEN ID</label>
              <input 
                className="qc-input" 
                style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#1e3a8a' }} 
                value={selectedId} 
                readOnly 
                placeholder="Tablodan seçiniz"
              />
            </div>

            <div className="form-group">
              <label style={{ color: '#2563eb' }}>COLOUR L</label>
              <input 
                type="number" 
                step="0.01"
                className="qc-input" 
                placeholder="0.00" 
                style={{ borderColor: '#bfdbfe' }}
                value={colourL}
                onChange={(e) => {
                  console.log("🔵 Colour L değişti:", e.target.value);
                  setColourL(e.target.value);
                }}
                disabled={!selectedId || updateLoading}
              />
            </div>

            <div className="form-group">
              <label style={{ color: '#2563eb' }}>COLOUR B</label>
              <input 
                type="number" 
                step="0.01"
                className="qc-input" 
                placeholder="0.00" 
                style={{ borderColor: '#bfdbfe' }}
                value={colourB}
                onChange={(e) => {
                  console.log("🔵 Colour B değişti:", e.target.value);
                  setColourB(e.target.value);
                }}
                disabled={!selectedId || updateLoading}
              />
            </div>

            <button 
              className="qc-btn" 
              style={{ width: '100%', marginTop: '10px', height: '50px' }}
              disabled={!selectedId || updateLoading}
              onClick={handleUpdate}
            >
              {updateLoading 
                ? "GÜNCELLENİYOR..." 
                : selectedId 
                  ? `${selectedId} NOLU KAYDI GÜNCELLE` 
                  : "KAYIT SEÇİNİZ"}
            </button>

            {selectedId && (
              <button 
                onClick={() => {
                  setSelectedId("");
                  setColourL("");
                  setColourB("");
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', marginTop: '5px' }}
                disabled={updateLoading}
              >
                Seçimi Temizle
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Laboratuvar;