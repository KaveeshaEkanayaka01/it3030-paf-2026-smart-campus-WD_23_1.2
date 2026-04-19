import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <AppProvider>
            <div className="min-h-screen font-sans text-slate-100 bg-transparent">
              <main>
                <AppRoutes />
              </main>

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
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
