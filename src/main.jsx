// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./style/global.css"
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './contexts/AppContext';
// import { AppProvider } from './contexts/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </HelmetProvider>
  </React.StrictMode>
);