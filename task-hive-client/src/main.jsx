import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './components/Context/AuthContext.jsx';
import { SignalRProvider } from './components/Context/SignalRContext.jsx';

import '@radix-ui/themes/styles.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SignalRProvider>
        <Theme>
          <App />
        </Theme>
      </SignalRProvider>
    </AuthProvider>
  </BrowserRouter>,
);
