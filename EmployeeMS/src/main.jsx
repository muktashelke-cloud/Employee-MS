import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext";   // ✅ ADD

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/common.css";
import "./index.css";
import './styles/base.css'
import './styles/variables.css'
import './styles/components.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>   {/* ✅ ADD THIS */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);