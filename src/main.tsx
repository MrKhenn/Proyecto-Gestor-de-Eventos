import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './api/AuthProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider> {/* 🔹 Ahora envuelve toda la app */}
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
