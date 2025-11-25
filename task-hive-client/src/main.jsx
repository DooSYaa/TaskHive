//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './components/Context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </AuthProvider>
  </BrowserRouter>,
  //</StrictMode>,
);
