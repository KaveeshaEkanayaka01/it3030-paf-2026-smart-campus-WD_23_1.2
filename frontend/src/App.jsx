import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen font-sans text-slate-100 bg-slate-900">
          <main>
            <AppRoutes />
          </main>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26, 26, 46, 0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: 'transparent' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: 'transparent' },
              },
            }}
          />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;