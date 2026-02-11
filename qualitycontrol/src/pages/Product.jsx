import React, { useState } from "react";
import { productActions } from "../api";

function Product() {
  const [formData, setFormData] = useState({
    productName: "",
    lotNo: "",
    bagNo: "",
    brutKg: "",
    netKg: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    // Validasyon
    if (!formData.productName || !formData.lotNo || !formData.bagNo || !formData.brutKg || !formData.netKg) {
      alert("Lütfen tüm alanları doldurunuz!");
      return;
    }

    setLoading(true);
    
    try {
      // Backend'e gönderilecek veri
      const dataToSend = {
        productName: formData.productName,
        lotNo: formData.lotNo,
        bagNo: formData.bagNo,
        brutKg: parseFloat(formData.brutKg),
        netKg: parseFloat(formData.netKg)
      };

      await productActions.save(dataToSend);
      
      alert("Ürün başarıyla kaydedildi!");
      
      // Formu temizle
      setFormData({
        productName: "",
        lotNo: "",
        bagNo: "",
        brutKg: "",
        netKg: ""
      });
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Ürün kaydedilirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">Ürün Ekleme</h2>

      <div className="card">
        <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.9rem' }}>
          Lütfen sisteme işlenecek yeni ürünün detaylarını eksiksiz giriniz.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="form-group">
            <label>PRODUCT NAME</label>
            <input 
              name="productName"
              className="qc-input" 
              placeholder="Örn: Polimer X" 
              value={formData.productName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>LOT NO</label>
            <input 
              name="lotNo"
              className="qc-input" 
              placeholder="Örn: L-2024-001" 
              value={formData.lotNo}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>BAG NO</label>
            <input 
              name="bagNo"
              className="qc-input" 
              placeholder="Örn: B-45" 
              value={formData.bagNo}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>BRUT KG</label>
            <input 
              name="brutKg"
              className="qc-input" 
              placeholder="0.00" 
              type="number"
              step="0.01"
              value={formData.brutKg}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>NET KG</label>
            <input 
              name="netKg"
              className="qc-input" 
              placeholder="0.00" 
              type="number"
              step="0.01"
              value={formData.netKg}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="qc-btn" 
            onClick={handleSave} 
            style={{ minWidth: '200px', height: '50px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? "KAYDEDİLİYOR..." : "ÜRÜNÜ KAYDET"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;