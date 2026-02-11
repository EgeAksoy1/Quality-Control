import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Bunu ekle
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Uygulamayı bununla sarmalla */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);