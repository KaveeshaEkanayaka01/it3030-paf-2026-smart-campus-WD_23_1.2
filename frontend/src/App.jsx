import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { CreateTicketPage } from './pages/createticket'
import { MyTicketsPage } from './pages/myticket'
import { TicketDetailsPage } from './pages/ticketDetails'

function App() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/my-tickets" replace />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
