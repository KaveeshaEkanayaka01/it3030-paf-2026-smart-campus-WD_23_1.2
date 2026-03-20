import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { CreateTicketPage } from './pages/createticket'
import { MyTicketsPage } from './pages/myticket'

function App() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/my-tickets" replace />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
