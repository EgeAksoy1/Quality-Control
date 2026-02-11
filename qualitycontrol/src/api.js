import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/rest/api",
  headers: {
    'Content-Type': 'application/json',
  }
});

export const userActions = {
  login: (username, password) => api.get(`/user/login/${username}/${password}`),
  list: () => api.get("/user/list"),
  save: (data) => {
    console.log("Kaydedilecek kullanıcı verisi:", data);
    return api.post("/user/save", data);
  },
  update: (id, data) => {
    console.log(`Güncellenecek kullanıcı (ID: ${id}):`, data);
    return api.put(`/user/update/${id}`, data);
  },
  delete: (id) => {
    console.log(`Silinecek kullanıcı ID: ${id}`);
    return api.delete(`/user/delete/${id}`);
  }
};

export const productActions = {
  list: () => api.get("/product/list"),
  save: (data) => {
    console.log("Kaydedilecek ürün verisi:", data);
    return api.post("/product/save", data);
  },
  update: (id, data) => {
    console.log(`Güncellenecek ürün (ID: ${id}):`, data);
    return api.put(`/product/update/${id}`, data);
  },
  search: (columnName, value) => api.get(`/product/search/${columnName}/${value}`)
};

export const convertColumnName = (frontendName) => {
  // Java'daki productDate, DB'de product_date olduğu için bu dönüşüm şart
  if (frontendName === "productDate") return "product_date"; 
  
  // Diğerlerini de otomatik çevir (productName -> product_name gibi)
  return frontendName.replace(/([A-Z])/g, '_$1').toLowerCase();
};