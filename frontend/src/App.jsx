import './index.css'
import { AppProvider } from './context/AppContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen font-sans text-slate-100">
        <main>
          <AppRoutes />
        </main>
      </div>
    </AppProvider>
  )
}

export default App
