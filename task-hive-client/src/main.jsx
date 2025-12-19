//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './components/Context/AuthContext.jsx';
import { SignalRProvider } from './components/Context/SignalRContext.jsx';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <SignalRProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </SignalRProvider>
    </AuthProvider>
  </BrowserRouter>,
  //</StrictMode>,
);
